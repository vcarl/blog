---
title: The Lerna license and ethics in software
published: true
description:
  The recent snafu with the Lerna project is a good opportunity to discuss our
  role in what we build, and what responsibilities we have in behaving
  ethically.
tags: software engineering, ethics
cover_image: https://thepracticaldev.s3.amazonaws.com/i/5rbswyv0oirluis5fhiu.jpg
date: 2018-09-03
---

(Cover photo by [Arto Marttinen](https://unsplash.com/photos/fHXP17AxOEk))

Earlier this week, Jamie Kyle and Daniel Stockman merged
[a PR to Lerna](https://github.com/lerna/lerna/pull/1616) adding a modified
version of the MIT license. The modifications specified that certain companies
were not granted a license to use the software due to their business contacts
with ICE, (Immigration and Customs Enforcement, a US law enforcement agency).
The rationale was given in the PR; ICE has been cruel to immigrants and refugees
and Jamie wanted to use his position in open source to respond.

I agree with his cause, though not his actions; ICE has crossed a line into
brutality and abuse that can't be defended. However, Jamie's change
[was quickly reverted](https://github.com/lerna/lerna/pull/1633). This is not a
summary or reaction piece—his actions have already been debated and rehashed
online, and I don't intend to pile on. It's made me think, though, about the
ethics of creating software and our ability to shape the industry in which we
spend our professional lives.

While I agree with Jamie in principle, I disagree with his execution. I think he
would have accomplished more if he had built support for his plan before merging
the new license. It is not enough to act alone when protesting the actions of
large organizations. The odds that a single open source contributor could
successfully pressure Microsoft and Palantir, a company that has raised two
billion dollars, into severing their contracts related to ICE, a federal law
enforcement agency, were low. The outcome does not surprise me.

> ## It is not enough to act alone when protesting the actions of large organizations

Our individual moral compasses can't be the only thing that guides us, because
we have very little leverage to enforce our beliefs. We as an industry have no
shared code of ethics; nobody to whom we can report violations. No license or
certification to give our statements weight, beyond our own reputation. In many
ways, the low barrier to entry is what makes software development great, but it
means we have limited protection against unethical behavior by our employers.

In other fields of engineering, there are professional societies or engineering
unions. The National Society of Professional Engineers (NSPE) includes
[a code of ethics](https://www.nspe.org/resources/ethics/code-ethics) that
members must abide by, backed by the organization itself. Members receive a
title of "Professional Engineer," which is widely respected in the industry, and
are expected to report ethical violations (by other engineers or their
employers) to the organization for review.

The fundamental canons listed in the NSPE code of ethics resonated with me:

> I. Fundamental Canons
>
> Engineers, in the fulfillment of their professional duties, shall:
>
> 1. Hold paramount the safety, health, and welfare of the public.
> 2. Perform services only in areas of their competence.
> 3. Issue public statements only in an objective and truthful manner.
> 4. Act for each employer or client as faithful agents or trustees.
> 5. Avoid deceptive acts.
> 6. Conduct themselves honorably, responsibly, ethically, and lawfully so as to
>    enhance the honor, reputation, and usefulness of the profession.

Violations of these ethics have cost lives or endangered the public. In 1981,
[a hotel walkway collapsed](https://en.wikipedia.org/wiki/Hyatt_Regency_walkway_collapse#Investigation)
because design changes had been approved without proper review. The Challenger
space shuttle failed because
[an engineer's manager overruled his recommendation](http://freakonomics.com/2011/06/01/launching-into-unethical-behavior-lessons-from-the-challenger-disaster/)
to delay the launch. In 2002,
[a nuclear power plant nearly failed](https://en.wikipedia.org/wiki/Davis%E2%80%93Besse_Nuclear_Power_Station#2002_reactor_head_hole)
because engineers signed off on falsified inspection reports.

Software development comes with a different set of ethical issues. Most of the
software we encounter in our day-to-day would not put our lives at risk if it
were to fail. The ethical quandaries in software engineering are more frequently
about the _success_ of projects, not about minimizing the risk of failure.
Software, and its impact on society, is still new, and we're still figuring out
what is destructive.

> ## The ethical quandaries in software engineering are more frequently about the _success_ of projects

The professional organizations most closely related to our field are the
Institute of Electrical and Electronics Engineers (IEEE) and the Association for
Computing Machinery (ACM), both of which have ethical codes on their website
([IEEE's](https://www.ieee.org/content/dam/ieee-org/ieee/web/org/about/ieee_code_of_conduct.pdf)
and [ACM's](https://www.acm.org/code-of-ethics)). But neither of these
organizations has had a strong presence in my career thus far, and neither code
of ethics has much to say on the unique capacity software has to influence
people's lives. The ACM ethical code is much, much more detailed than IEEE's,
but the sections on avoiding harm and protecting privacy are insufficient to
provide guidance on the ethical questions in software today.

Is it ethical for Facebook to gather and sell the volume of data that they do?
Facebook has made changes to the data it sells to its customers, but only after
the question of government regulation was raised. Facebook has exceptionally
fine-grained knowledge about its users' behavior and preferences, which it
exposes to its advertising customers largely unfiltered. Is it ethical to allow
advertisers such laser focus for their campaigns?

Is it ethical for YouTube to suspend channels without warning because of
copyright claims? Google has infamously poor customer service, despite an
increasing number of people relying on their platform for their livelihood. Does
Google have an ethical responsibility to improve their process? Or is the
ethical onus on content providers to be more diligent when identifying
infringing videos?

It's clearly unethical for car manufacturers to cheat emissions tests—yet
[Volkswagen, Chrysler, Jeep, Nissan, Renault, and Mercedes](https://en.wikipedia.org/wiki/Diesel_emissions_scandal#Manufacturers)
were all found to be using software to do so. Skirting regulations is illegal
and automotive manufacturers were penalized for their emissions cheating, but
that unethical behavior is not present in other their areas of engineering. I
posit that this is because of the lack of a code of ethics for software
engineering.

It takes strength to take a stand for what you believe in and do something
controversial, and I applaud Jamie's courage for his attempt with Lerna. But to
have real, lasting impact on unethical behavior, we have to do more than take
individual action. We need to lay some ground rules for what we as developers
consider to be ethical software development.

We need a frank discussion of what ethical software development is, and we need
a reference that we can use for guidance on whether a project is ethical. I'd
love to see your thoughts on ethics in software in the comments, but I've also
created a [Discord server](https://discord.gg/bpCwzzx) and
[a GitHub repository](https://github.com/vcarl/ethical-software/issues/1) to
capture discussions.

What unethical behavior have you seen in the industry?

If software development had a code of ethics, what would our fundamental canons
be?
