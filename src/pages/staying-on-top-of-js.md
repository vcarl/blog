---
title: Staying on top of new Javascript features
published: true
description:
  Keeping up to date with new features in Javascript is hard—unless you know
  where to look.
tags: javascript, beginners, node
cover_image: https://thepracticaldev.s3.amazonaws.com/i/7blz088yi3boyylk789r.jpg
canonical_url: https://medium.com/@vcarl/staying-on-top-of-new-javascript-features-8f63c3e76bc2
date: 2018-08-27
---

(image credit: [Andrew Charney](https://unsplash.com/photos/e3iwXJhT3Zk))

With modern JS tooling, we have an opportunity to use Javascript features before
they are implemented in browsers or node. However, not all features are equal.
Some are more likely than others to be integrated into the language. Some will
undergo significant changes before being added, and some will be dropped
altogether. If you're using that feature in your app, either of those can
introduce big refactors. But how can you tell whether a feature is something you
should use?

New features are introduced by TC39, a committee responsible for maintaining the
specification underlying Javascript. There is a complete list of proposed
additions to the spec in the
[TC39 proposals repo](https://github.com/tc39/proposals/) on GitHub. This is
_the_ canonical location for new features, the primary source. There is a
well-defined process that proposals must go through, and learning more about
that process will help you stay on the cutting edge.

The [TC39 Process document](https://tc39.github.io/process-document/) defines
what steps a proposal must take. This document is the source of the various
stages that each feature goes through, which you may know best from the various
stage-X presets from Babel. These stages are called the "maturity stages." The
table defining the stages is a quick read that will give you a ton of context
for how much has gone into a given proposal.

What does it mean to be "stage 1" though? If there's a Babel plugin for it, why
shouldn't we use a feature? To answer that, let's walk through what the
different stages mean.

# TC39 maturity stages

## Stage 0

Brand new proposals are referred to as "strawman" or "stage 0" proposals. Stage
0 has _very little_ significance. It means that somebody has formally proposed
an idea to the committee—that's it. The process document notes that this stage
has no restrictions and does not require an attempt at specifying behavior. TC39
maintains
[a list of stage 0 proposals](https://github.com/tc39/proposals/blob/master/stage-0-proposals.md),
some of which have not progressed towards standardization in 4 years, and
several of which have been
[formally dropped](https://github.com/tc39/proposals/blob/master/inactive-proposals.md).

Relying on stage 0 features in production apps is a gamble in the long run. So
why have developers downloaded
[the stage 0 Babel preset](https://www.npmjs.com/package/babel-preset-stage-0)
740,000 times (at time of writing) in the past week?

![A download chart for babel-preset-stage-0 showing 740,000 downloads this week](https://thepracticaldev.s3.amazonaws.com/i/dxggi3a8zemh2y4av34d.PNG)

Are you using it? ...should you be?

## Stages 1-3

These stages live [in the readme](https://github.com/tc39/proposals) of the TC39
proposals repo. These are the features actively working their way through the
process.

Stages 1 and 2 require an attempt to specify the behavior of the proposed
feature, but implementations are intended to be exploratory. The more complex
the proposal, the more likely it is to change as it moves from stage 1 to 2
to 3. If you rely on a proposal whose behavior changes, you may be stuck with a
significant rewrite if you ever want to update your build tools.

A perfect example of this churn is the proposals to add "decorators" to
Javascript. They gained a lot of popularity when a proposal hit stage 2 in 2016,
but it has not progressed to stage 3 (as of mid-2018). The proposal has changed
substantially, and some of the original use cases are no longer supported in
updated proposals.

Familiarizing yourself with the list of stage 3 proposals is the best way to
keep track of what's around the corner in Javascript. A proposal advances to
stage 3 once designated reviewers and ECMAScript editors have approved of the
complete specification. It may already be usable in a browser and likely has a
Babel transform. All implementations must adhere to the spec, and changes are
unlikely.

That's not to say that stage 3 proposals are guaranteed to advance. Features at
earlier stages are less likely to enter the spec because of how much work it
takes to completely specify the behavior and implement it in browsers. Features
at stage 3 may be rejected because irreconcilable issues are discovered while
implementing, or in the case of `Object.observe`, because the feature was deemed
unnecessary.

## Stage 4

Proposals that are considered complete and ready for formal inclusion in the
spec advance to stage 4. These move to the
[finished proposals](https://github.com/tc39/proposals/blob/master/finished-proposals.md)
section of the TC39 proposals repo. A large amount of work is required to
advance from stage 3 to 4. There must be acceptance tests and must be
implemented in 2 independent VMs.

# Some history

TC39 and the release process were created relatively recently. If it feels like
Javascript has changed a lot in the past few years, you're not wrong.

## Ecma International and ECMAScript

Javascript is an implementation of a language specification called "ECMAScript,"
[ECMA-262](https://tc39.github.io/ecma262/).
[Ecma International](https://www.ecma-international.org/) is a European
standards body similar to ISO. ECMAScript is why the abbreviation for new
versions are ES5, ES6, etc. In 2015, they changed the process to an annual
release cycle, coinciding with the release of ES6–this is why it's also called
ES2015. It's worth noting the gaps between new versions of ECMAScript. (I'd also
like to note that those are the correct capitalizations; Ecma de-acronym-ized
their name in 1994, but ECMAScript is still styled that way in the spec)

- 1999, ES3
- 2009, ES5, originally ES3.1
- 2015, ES2015, with annual releases ever since.

## ES6, ES2015, or ES Harmony

ES2015 was a turning point for Javascript, both technically and with regards to
future extensions. It introduced a laundry list of new features, enumerated in
[the old Babel docs](https://old.babeljs.io/learn-es2015/), and was the first
release under the new process.

These features completely reinvented Javascript. The reasons behind the sudden
explosion of new features are largely political, and I won't attempt to recap
them in depth. The short version is that the evolution of ES5 was contentious.
It was originally intended to be released as ES3.1, but the final version
included some features from the unsuccessful ES4 revision. If you're interested,
[the ES4 draft](https://www.ecma-international.org/activities/Languages/Language%20overview.pdf)
is good to skim through.

Following ES5, ES2015 was the first release under a newly developed process, led
by TC39
([Technical Committee 39 of Ecma](https://www.ecma-international.org/memento/tc39-rf-tg.htm)).
It was the first release after the various factions reconciled and began working
together again, hence the codename "Harmony."

Because this new process has been working so smoothly, recent releases of
ECMAScript have not been the significant overhauls that ES2015 were. Dr. Axel
Rauschmayer's blog has excellent summaries of the new features introduced in
each [2016](http://2ality.com/2016/01/ECMAscript-2016.html)
[2017](http://2ality.com/2016/02/ECMAscript-2017.html), and
[2018](http://2ality.com/2017/02/ECMAscript-2018.html).

## Modern Javascript

These official releases have become less important. Babel enables us to use
features months or years before they're officially released, and we may not use
the native implementations for years afterward due to legacy browsers. Babel has
moved to make it even easier for us to forget about this process with
[`babel-preset-env`](https://babeljs.io/docs/en/babel-preset-env/). By
configuring it with what browsers you need to support, it will provide minimal
transpilation and polyfills to use native implementations whenever possible.

Babel has also moved to deprecate the `stage-x` presets for reasons given in a
[blog post announcing the change](https://babeljs.io/blog/2018/07/27/removing-babels-stage-presets).
`babel-preset-env` provides a much more developer-centric solution to the same
problem, and is recommended instead of manually setting presets.

---

Thanks for reading! I'm on Twitter as [@vcarl_](https://twitter.com/vcarl_)
(but most other places I'm vcarl). I moderate
[Reactiflux](http://join.reactiflux.com/), a chatroom for React developers and
[Nodeiflux](https://discordapp.com/invite/vUsrbjd), a chatroom for Node.JS
developers. If you have any questions or suggestions, reach out!
