---
title: Development and emergencies
published: true
description:
  What should you respond when an interviewer asks you, “Do you have any
  questions for us?” This series will give you questions that will help
  you identify problem environments before you start working.
series: Questions to ask your interviewer
tags: career, interviews
cover_image: https://cdn-images-1.medium.com/max/2000/0*9S3RRUnSTnyKPYHR.
canonical_url: https://medium.com/@vcarl/questions-to-ask-your-interviewer-development-and-emergencies-f7fbc4519e5b
date: 2018-05-17
---

(image credit: [Hack Capital](https://unsplash.com/@hackcapital))

In my career I have worked for 6 different companies, ranging from 4th
hire at a startup to a senior developer at a Fortune 100 financial
company. This leaves me an uncommon perspective on how a wide range of
companies operate. Changing jobs so many times has given me a lot of
experience interviewing, as well.

I’ve compiled a list of questions that I ask, wish I had asked, or plan
to ask in the future. Each question has details about why I find that
question valuable and what answers I expect. It ended up being a lot
longer than I expected, so I’m splitting it up into several parts so it
isn’t too overwhelming:

- The onboarding process, workplace, and team
- The development environment and emergency situations (this one)
- Personal growth
- Project management

The development environment is a product of the developers building it
and the culture created by managers, and a good development environment
means fewer emergencies. I read something years ago that stuck with me:
“Instead of saying ‘I don’t have time’ try saying ‘it’s not a priority,’
and see how that feels.” (As best I can tell, it’s from a
[2012 Wall Street Journal piece](https://www.wsj.com/articles/SB10001424052970203358704577237603853394654)
by [Laura Vanderkam](https://twitter.com/lvanderkam)). Given competing
priorities, too many companies forego maintenance tasks. “There isn’t
time this sprint,” is something I’ve heard all too often. “We’ll pick it
up later.”

> Instead of saying “I don’t have time” try saying “it’s not a
> priority,” and see how that feels.

These moments of deferred maintenance stack up, turning into a culture
that doesn’t value details. Organizations that value maintenance have
happier, more effective developers. Hopefully, the questions here will
help you spot on one from the outside.

# Development environment

## How long does it take to do a complete deployment?

Long deployments are often manual, and more prone to errors and
accidental downtime. Long deployments increase cycle times, which makes
people more nervous to make changes. This question can also serve as a
proxy for how non-developers view improvements that aren’t user-facing.
User experience should be a priority, but a good developer experience
helps deliver value more often (and it’s good for morale and
recruitment. Happy developers tell their friends).

I work in frontend, and as such generally ship static files as build
artifacts. I prefer to hear that deployments are less than 15 minutes,
and that it doesn’t need to be run a specific person. I’m ecstatic if
they have the ability to build several testing environments at once, but
I’ve found that rare.

## What is a big pull request, in lines of code or files affected? How long is it open?

Small PRs are simpler to manage. They cause fewer merge conflicts, and
the ones that do occur are smaller. Smaller PRs mean you’re merging more
frequently, which means they’re following modern continuous delivery
strategies. Large, long-lived branches can be a sign of a lack of rigor
in managing tasks or inexperienced senior developers, who should be
leading the charge on maintenance tasks. Large PRs are the only option
in codebases where many modules are tightly coupled, so shipping small
PRs is a signal that the code is more likely to be well structured.

To me, a big PR might be 2000 lines of code, or touching 20 different
files. I prefer to open PRs early as work-in-progress and might have it
open for half of a two-week sprint. I do this to ask for input and code
review from coworkers early on, even if we can’t pair together on the
task. When developers open PRs only when the task is done, it should
touch no more than a handful of files and change less than a few hundred
lines of code–at most.

Another positive signal I look for is when the team ships changes behind
feature flags. Feature flags are easier to use when code has clear
separation of responsibilities. Seeing feature flags gives me more
confidence that the code is well maintained, but it’s not a silver
bullet. I’ve worked on spaghetti code that use feature flagging as well.

## How many repositories would I touch to make routine changes?

Some projects might be in a monorepo so large that there are a thousand
commits a day. Other projects might be a web of interlinked dependencies
scattered across a dozen repositories. This question should kick off a
conversation about project structure and code sharing.

For young companies that only have a single product, having a large
number of repositories is a red flag. Making changes across many
repositories takes longer and requires more care, and young companies
should be focused on creating something people want. For established
companies, I’d want to ask how they manage code duplication and internal
libraries. It’s not a simple problem and there are many approaches.

How often do developers have to make simultaneous changes across
repositories? Needing to coordinate changes across repositories signals
tighter coupling between modules. It’s a red flag to have different
services that need to be deployed at the same time–it demonstrates that
the services are fragile. Robust and durable services must be able to
compensate for predictable failures. If it’s difficult to deploy a new
version of a service, it’s a hint that the service doesn’t have well
defined responsibilities.

Deploying a module shouldn’t require a simultaneous deployment of
something else. A new patch version of an internal dependency shouldn’t
break the code that consumes it. Changes to an HTTP API should be
backwards-compatible with existing clients. Security patches to
libraries may need a series of deployments before they’re completely
rolled out, but that isn’t due to fragility. The best answer for this is
“never,” though it might happen due to unintentional coupling.

# Emergency situations

These are questions that I added in direct response to previous
experiences. They are not questions I asked, but are questions that, if
I had asked, I might have saved myself several stressful months.

## How often do you have major outages? What constitutes a major outage for you?

Major outages should be infrequent, by which I mean with several months
with no events. The clarification is important to avoid a
miscommunication due to different definitions of a “major outage.” You
may think of major outages as any time the customer can’t access any
feature, but they may view it as when the app stops responding
altogether. Their answer might be truthful but use such a different
yardstick that it doesn’t answer your question.

Frequent major outages could indicate code that is tremendously
difficult to change. It could be significant numbers of unknown
dependencies in the codebase. Maybe they’ve had large amounts of
turnover and lost undocumented knowledge. They may have avoided paying
interest on tech debt for years. A software company that can’t
consistently run its own code is in dire straits.

## Do you have a defined process for handling an outage?

For a startup that’s still young, a lack of process might well be a good
sign—the code has worked reliably so far. A lack of process means that
they haven’t had enough outages to merit codifying a process around
them. The more established a company is, the more concerned I am if they
haven’t thought through how to handle an outage. Large companies should
have processes in place for how to handle major issues and prevent them
from reoccurring.

## Would I be expected to be on-call?

It’s up to you whether this is to be expected or an unreasonable
request. The more 9s of uptime expected from your code, the more likely
you are to have some amount of on-call duty. When your code runs is also
a factor. If you’ll be responsible for ingesting data from third parties
overnight, you’re more likely to have to deal with unexpected breakage
at odd hours than web or mobile developers. You’ll need to talk to your
peers and identify whether on-call is a reasonable expectation for the
work you prefer doing.

## What does your on-call process look like?

If you’ve established that you will be on-call, know what you’re getting
into! How often does the on-call person get paged, how it will impact
paid time off, what the escalation process is. Being on-call is a much
larger responsibility that just writing code, so know what you’re
getting into.

I’ve been required to be on-call for two jobs that I’ve worked. In both
cases, I was on call for a week at a time, with a second developer as a
backup. It ended up being a big factor in why I left both positions. If
I were interviewing for a role that expected me to be on-call, I’d want
to dig deeply into the why they instituted the policy and what they’re
doing to reduce the frequency of pages.

---

Thanks for reading the second group of questions to ask your
interviewer! Stay tuned for part three, with questions about
opportunities for personal growth, in a few days. I’m on Twitter as
[@vcarl\_](https://twitter.com/vcarl_), and I moderate
[Reactiflux](https://discord.gg/s6dJcJt), a chatroom for React
developers (shoutout to the
[jobs-advice channel](https://discord.gg/s6dJcJt)), and
[Nodeiflux](https://discordapp.com/invite/vUsrbjd), a chatroom for
Node.JS developers. If you have any questions or suggestions, reach out!
