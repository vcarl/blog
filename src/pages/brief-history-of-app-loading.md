---
title: A brief history of web app loading
published: true
description:
  A (somewhat) short summary of the iteration of technology used to build and
  load web apps.
tags: javascript, node, history
cover_image: https://cdn-images-1.medium.com/max/800/1*9EBHIOzhE1XfMYoKz1JcsQ.gif
canonical_url: https://medium.com/p/a-brief-history-of-web-app-loading-ab8409e48812
date: 2018-07-31
---

In the beginning, there was the `<script>` tag.

We managed dependencies by carefully arranging our scripts in our HTML. You had
to load jQuery before you loaded your plugins, your libraries before your app
code. As we began adding more interactivity and evolved from websites to web
apps, this began to get out of hand. Large projects had complex waterfalls of
requests that were difficult to manage and optimize. We had `defer` and `async`
attributes, but they only help in some circumstances. We needed a better way to
manage our dependencies.

The first step forward was when we began concatenating our scripts together.
This reduced the total number of HTTP requests and helped guarantee execution
order, but it remained a manual process. Scripts had to be concatenated together
in the correct order to work. We concatenated scripts into groups to balance
each file's size against the total number of requests, but we still had to
specify the order and grouping. This is about the time that the concept of
having a build step for your Javascript gained popularity.

[Grunt](https://gruntjs.com/) became the first widely popular "task runner,"
used to concatenate scripts and optimize assets. Its configuration grew unwieldy
on larger projects though, and [Gulp](https://gulpjs.com/) refined the ideas
into a "streaming" API that was simpler to reason about and faster.

As we became more comfortable with the idea of having a build step,
[CoffeeScript](https://coffeescript.org/) entered as the first popular alternate
syntax. With so many apps written with Ruby on Rails, web developers craved the
simpler syntax of Ruby. Many of CoffeeScript's ideas were eventually folded into
ES2015—you can thank it for `=>` and `...`, among others. Another concept it
helped popularize was separating code into modules. Each compiled CoffeeScript
file was inserted into its own IIFE (immediately instantiated function
expression), scoping each script to prevent polluting the global namespace.

[Require.js](https://requirejs.org/) and [Bower](https://bower.io/) came onto
the scene to help us wrangle our third-party code. Require.js introduced
"asynchronous module definitions," or AMD modules, a packaging method still used
by some apps. They were loaded into the browser on-demand, which was super cool!
No more manually shuffling script tags. The syntax was a little clunky,

```js
// from http://requirejs.org/docs/api.html
requirejs(['jquery', 'canvas', 'app/sub'], function($, canvas, sub) {
  //jQuery, canvas and the app/sub module are all
  //loaded and can be used here now.
});
```

but it was much better than manually managing the order ourselves. Bower was
initially a complement to npm, before npm had many modules that supported
running in the browser. Eventually, Bower was deprecated in favor of npm, and
Require.js added the option of passing a require function to emulate commonJS
modules from node.

```js
define(function(require, exports, module) {
  var $ = require('jquery');
  var canvas = require('canvas');
  var sub = require('app/sub');
});
```

So now we had something that automatically managed which scripts to load and in
which order to load them. Life was good. Slowly, a new problem began to develop:
it was so easy to add dependencies that we began to use a lot. Because each
dependency was loaded as a separate script, loading a web app would kick off
dozens— or even hundreds—of HTTP requests for tiny .js files. The simultaneous
requests would block each other from loading, delaying initial load.

There were several fixes developed for this. The problem was taken into
consideration for the design of HTTP2, which added multiplexing to help
alleviate the problem. Require.js added an optimizer tool that would bundle up
these modules up into a single file or group of files, but it wasn't suitable
for development and was tricky to configure. HTTP2 rolled out very slowly, and
ultimately wasn't the silver bullet people hoped it would be.

Developers began experimenting with alternatives, and the number of tools for
bundling dependencies exploded. Browserify, Broccoli.js, Rollup, webpack, and
surely others that I never heard about. There are still more being created, with
Parcel being the most recent addition I know of. They all have slightly
different takes on API and features. webpack won mindshare for apps because of
its excellent code splitting features and flexibility, and later iterations
significantly improved usability (seriously webpack 4 is fantastic). Rollup has
become a go-to tool for bundling libraries because it produces the smallest
bundle in most cases.

![An animated gif showing an analyzer's output, with several JS bundles containing many dependencies](https://cloud.githubusercontent.com/assets/302213/20628702/93f72404-b338-11e6-92d4-9a365550a701.gif)

This focus on tools for resolving dependencies revealed some shortcomings with
CommonJS' `require` function. `require` was created as part of Node.js, and had
some semantics that made it more difficult to use in the browser. TC39
standardized a module definition specification, ES modules, that better meets
the different use cases in Node.js and the browser. It's still
evolving—[Node.js recently released version 10](https://nodejs.org/docs/latest-v10.x/api/esm.html)
with experimental support, and
[the dynamic `import()` function](https://github.com/tc39/proposal-dynamic-import)
hasn't quite landed.

That brings us to today. Webpack is the de-facto bundler for several years now
and has steadily improved over the years. Not only can we define bundles of
Javascript, we can specify which files depend on stylesheets or images and load
them only when needed. Loaders exist to inline images below a certain size, and
some crazy folks have started writing their CSS in their JS (try it, it's
great).

I didn't even touch on Yarn vs npm vs pnpm, services like unpkg, or any of the
drama and arguments that got us where we are today. npm has taken off into the
stratosphere after hitting
[a billion downloads a week in 2016](https://blog.npmjs.org/post/143451680695/how-many-npm-users-are-there),
with the numbers at
[the beginning of 2018](https://www.npmjs.com/npm/state-of-javascript-frameworks-2017-part-1)
dwarfing those. The challenges we have today are around when not to use
dependencies, and keeping an eye on the total amount of code we're shipping.

This is just a representation of what I've experienced firsthand in the past 6
years of writing code that runs in the browser. It's a short period of time in
the history of the web, but the amount of innovation and evolution has been
incredible to watch.

---

Thanks for reading! I'm on Twitter as [@vcarl_](https://twitter.com/vcarl_)
(but most other places I'm vcarl). I moderate
[Reactiflux](http://join.reactiflux.com/), a chatroom for React developers and
[Nodeiflux](https://discordapp.com/invite/vUsrbjd), a chatroom for Node.JS
developers. If you have any questions or suggestions, reach out!
