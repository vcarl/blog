---
title: Moving 140,000 commits from Mercurial to Git
published: true
description:
  I converted our repo from Hg to Git while preserving history. I ran
  into some hitches, some of the tools failed outright.
tags: programming
date: 2017-01-17
---

I recently volunteered to lead the charge on migrating my team from
Mercurial to Git. Most of the company has been on Git for a few months,
and this particular repository—of which my team only uses a small
portion—is the largest still residing in Hg (Mercurial).

The repository was used as a monorepo for a wide assortment of projects
over the 6 years it's been in use. There are around 50 Visual Studio
Solutions referencing over 200 projects, with a total history of nearly
140,000 commits. `du -ch .hg/` tells me the history is over 1GB, and
`du -ch ./*` reports the current contents come to about 800MB. One of my
goals with this migration is to improve repository performance, as
cloning the repo from scratch is an all day affair, and the Hg GUI tools
I've tried have all struggled under the weight of the history. Luckily,
of the ~180 folders at the root level, my team only cares about 1.

So how can I remove what we don't use without blowing away all of the
history?

---

First, I did some research on what tools are available that can convert
an Hg repository to use Git while preserving history. GitHub actually
provides a
[repository importer](https://help.github.com/articles/about-github-importer/)
that can import from Hg when creating a new repo, and there's an open
source project called [fast-export](https://github.com/frej/fast-export)
that can do the same locally. Later on in the process, I also found the
[Mercurial ConvertExtension](https://www.mercurial-scm.org/wiki/ConvertExtension)
which advertises similar capabilities.

My first efforts were less than encouraging. Transforming 140k history
entries takes a while, so it wasn't until about an hour and a half later
that I got word from the GitHub importer that the repository was too
large to import, and it took another 45 minutes for `fast-export` to
fail with an error about an invalid date on a commit. Drat. Trying
fast-export again with `--force` got it past the first error, only to
fail on another invalid date later in the conversion. I later learned
these errors weren't _caused_ by the date, it was just a symptom.

Given that these errors occur on revisions that are several months old
and that I wanted to reduce the size of the repository anyway, I started
looking for a way to prune the history before converting to Git. I found
the Mercurial ConvertExtension which purported to do Hg > Hg conversions
(and a lot more) with options for starting at a specific revision,
filtering files out of history, and all sorts of powerful options.
However, it consistently failed with an obscure error about an invalid
compression type about 3/4ths of the way through the history
(`Abort: invalid compression type ‘k’` and `compression type ‘6’` were
both seen. Not helpful). IRC, StackOverflow, and years-old mailing lists
were unable to help me get it working, and after a day without progress
I had to abandon this tool that seemed so promising.

After these defeats, I talked to a coworker who had done a similar
conversion in the past. He pointed me to `fast-export` and a pair of
tools for mass-modifying history called
[git-filter-branch](https://git-scm.com/docs/git-filter-branch) and
[BFG Repo-Cleaner](https://rtyley.github.io/bfg-repo-cleaner/). He also
mentioned the same invalid date issue I saw, and
[pointed me to a solution](https://github.com/frej/fast-export/issues/15#issuecomment-65903469)—the
error wasn't the date, it was a null author causing misaligned columns.
Running `fast-export` with that `authors.txt` file worked! About an hour
later, I had an equivalent Git repository, with a backup so I could
screw with history all I wanted without having to re-export from
scratch. And to keep it up-to-date with changes my coworkers were
making, `fast-export` will do incremental exports as long as nothing new
has been committed to the exported Git repo.

Now that I had our complete history in Git, I could start trying to pare
it down to a manageable size.

Some trial runs with BFG Repo-Cleaner showed it was very good at its
job, reducing the size of the `.git` folder from ~1.6GB post-export down
to around ~100MB in minute or two. But it still left me with the same
number of commits, implying there were tens of thousands of empty
revisions clogging up the history. `git-filter-branch` supports pruning
empty commits with `--prune-empty`, but some experimentation showed it
would take over 2 hours to completely process the history.

Luckily, not only has somebody
[opened a PR](https://github.com/rtyley/bfg-repo-cleaner/pull/147)
adding `--prune-empty-commits` to BFG Repo-Cleaner, but when it hadn't
been merged after a few months, they
[published a .jar](https://github.com/rtyley/bfg-repo-cleaner/pull/147#issuecomment-224770369)!
With this .jar and the new flag, the Git history has gone from almost
140k commits to about 30k, and the`.git` folder is down to ~70MB. Still
a large repo, but a huge, vast improvement. To be thorough, I ran
`git filter-branch --prune-empty` afterwards to see if there were any
more commits to find. It got the history down to ~27k commits and took
about 25 minutes—a small improvement that takes quite a while, but still
worth it for a one-time migration.

Ultimately I had to write up two scripts to automate the process. One
script was run on each branch we needed to keep, deleting unnecessary
files and creating a `.gitignore`, and one "coordinating" script that
did repo-wide tasks like renaming and deleting branches, running the
other script on each branch, removing deleted files from history, and
garbage collecting the git repo.

To recap, before the migration, we had:

- 6 years of history 1.2GB in .hg
- 800MB of current files ~50 Visual Studio solutions
- ~200 Visual Studio projects
- 140,000 commits
- ~180 top levelfolders my team doesn't use

After the migration, we’re left with:

- Still 6 years of history
- 70MB in .git
- 15MB of current files
- 0 solutions
- 0 projects
- 27,000 commits
- No files that we don't use

Tools successfully used:

- [fast-export](https://github.com/frej/fast-export), and
  [a custom authors.txt](https://github.com/frej/fast-export/issues/15#issuecomment-65903469)
- [BFG Repo-Cleaner](https://rtyley.github.io/bfg-repo-cleaner/) (and
  [an unreleased jar](https://github.com/rtyley/bfg-repo-cleaner/pull/147#issuecomment-224770369))
- [git-filter-branch](https://git-scm.com/docs/git-filter-branch) A few
  custom bash scripts to tie them together.

My lessons learned:

The process of changing SCM systems and mass-modifying history was
actually a lot easier than I expected. I came away with a negative
impression of Hg; it allowed corrupt commits into the history that
caused multiple tools to fail. The tools for manipulating Git history
were a lot more straightforward than the ConvertExtension. I spent a lot
of time reading docs and asking questions about it on IRC and never felt
I was getting closer to understanding how it was supposed to be
configured. And it gave me yet another demonstration that, no matter how
odd and unique you think your problem is, somebody else has had to do
the same thing.
