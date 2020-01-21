---
title: Securing a large Gatsby site with a CSP
date: 2020-01-21
updated:
description:
  Content security policies are a great way to lock down your website,
  and it can be relatively painless to get some benefit.
tags: javascript, react, security
cover_image: /images/unlocked.min.jpg
---

(Photo by [Piotr Hamryszczak](https://unsplash.com/photos/P2k3JttAlho))

Recently I shipped a large project using some of the hot new tools in
the React community—Gatsby and MDX—serving a global audience with about
160 different pages (blog posts, landing pages, and indexes). Because I
work in the cryptocurrency space, which has a relatively large
population of suspicious actors, I wanted to do everything I could for
security. One of the ways I did this was to ensure I had a restrictive
Content Security Policy (CSP).

Content security policies allow you to whitelist where resources can be
loaded from, what external connections can be made, and what types of
code can be run. It's a way to lock down the wild-west execution
environments that are the browsers of the general public by removing
certain attack vectors. I learned that CSPs are difficult to get right,
but new policies can be rolled out safely.

CSP rules are granular to the extreme, and the rules for writing them
are tricky. Because of how various browsers and common tools work, I
discovered that there were many violations I didn't expect, that are
difficult to verify, and that there might be new errors at any time.
Because CSPs are a whitelist, I had to learn a lot about the details in
order to get it working properly.

It took a lot of trial and error.

![list of 6 pull requests from September 6th to December 18th](/images/csp-trial-and-error.png)

## Limits from Gatsby and MDX

One problem I had very quickly was that Gatsby and MDX, at time of
writing, require some large carve-outs in order to operate. There are 2
rules that, left out of the whitelist, close a lot of the methods of XSS
attack.

- `'unsafe-eval'`
- `'unsafe-inline'`

These 2 methods are the most common ways to inject malicious JS onto
pages. `'unsafe-eval'` prevents strings from being executed as code, and
`'unsafe-inline'` requires that all scripts be loaded from files over
the network. With these two omitted and a list of acceptable domains
scripts can come from, this gives you a high degree of confidence that
you aren't vulnerable to XSS attacks—your server would have to be
compromised before malicious scripts can be executed.

However, Gatsby itself places many inline styles and scripts on the
page, and MDX uses `new Function`. Because they make use of this
functionality, we have to punch pretty big hole in the security policy.
On the one hand, this is pretty great: there are very few problems, it's
really really close to letting us be extremely restrictive with our
security rules. On the other hand, _there are so few problems_: so
close, yet so far. I can't lock the policy all the way down.

Gatsby has
[an umbrella issue](https://github.com/gatsbyjs/gatsby/issues/10890) for
these problems, and there's
[a workaround for MDX](https://github.com/ChristopherBiscardi/gatsby-mdx/issues/303#issuecomment-469095503)
(with some restrictions on how you can write your code). There's also
[`gatsby-plugin-csp`](https://github.com/bejamas/gatsby-plugin-csp),
which will determine hashes for inlined scripts so they can be
whitelisted without `unsafe-inline`, but it outputs to a `<meta>` tag
thus disallowing `report-uri`. Ultimately these options didn't work for
my codebase.

## Launching the CSP

After getting a CSP that allowed all our images, any iframes, data
sources, embedded media, and form submission targets, I added it in
report-only mode and set it loose. This is what makes it so easy to roll
out a new CSP: you can put it in place where it will emit errors, but
not block content. This lets you spot problems before they surface for
your visitors and fix errors before they see them.

In rolled the browser errors. Some are frequent enough to make me think
it's every user of a certain device or browser, teaching me something
about how varied the web is. One error that seems obvious in hindsight
is translation services. I found Google Translate specifically difficult
to test, though. The website allows you to browse via an iframe, which
runs into completely different CSP rules as the in-Chrome "do you want
to translate this page?" prompt, and it took a trick to make that prompt
appear.

## Quickly finding mistakes

Very fortuitously, one of my good friends published a CSP evaluation
tool, [csper.io](https://csper.io/#/evaluator), which helped me catch a
number of silly mistakes that accidentally weakened my policy. CSPs have
an fiddly syntax, and because they only warn when the rule is violated,
broken rules can be invisible.

```diff
-base-uri none;
+base-uri 'none';
```

In CSPs, values without strings are interpreted as URLs. Here, `none` is
actually being interpreted as `https://none`. This isn't a _large_
problem, because that's not a domain that can be registered and thus not
a significant vector, but it's annoying to accidentally leave something
subtly broken.

## The final policy

The final CSP is quite long, much longer than I expected going into it.
(I've anonymized this to remove specific servers, replacing them with
generic addresses)

```
block-all-mixed-content;
base-uri 'none';
default-src 'self';
object-src 'none';
frame-ancestors 'self';

form-action https://company-name.us9.list-manage.com;

img-src data: https: android-webview-video-poster: android-webview:;

font-src data: 'self' https://cdn.embedly.com https://fonts.gstatic.com;

style-src 'unsafe-inline' 'self' https://translate.googleapis.com https://cdn.embedly.com;

frame-src https://runkit.com https://third-party-iframe.example.com https://www.youtube.com https://cdn.embedly.com;

connect-src 'self' https://company-api.example.com https://sentry.io https://third-party-api.example.com https://api-cdn.embed.ly https://translate.googleapis.com https://www.google-analytics.com;

script-src 'self' 'unsafe-eval' 'unsafe-inline' 'data' https://embed.runkit.com https://www.google-analytics.com https://company-name.us9.list-manage.com https://translate.googleapis.com https://translate.google.com https://api.microsofttranslator.com cdn.embedly.com;

report-uri https://sentry.io/api/id/security/?sentry_key=key;
```

## In summary

Because this is a whitelist, I know that I'll have to keep an eye on the
violations to see if useful services become blocked in the future. If a
translation service starts using a new domain, it won't work until I add
it to the whitelist. There are enough real violations to make this a
large set to sort through, making that a bit of a challenge.

Csper helped me tighten up my rules by giving me prioritized
suggestions, which I found reasonable and easy to change. They were also
descriptive enough that I learned a lot about the possible attack
vectors that websites face. For a fee, it can also be used for long-term
monitoring, which could prove more useful than Sentry's reports due to
the specialization.

Overall, I felt adding a CSP was worth the effort invested in adding it,
though the process was slower moving than I'd hoped. Because errors
frequently came from unusual combinations of browsers, extensions, and
third-party tools, I needed to gather several days worth of reports
before I felt confident after making any changes to the policy. If I had
started from [csper.io](https://csper.io/#/evaluator), I think I would
have saved myself a lot of time when I was learning how CSPs work.
