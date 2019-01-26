---
title: Testing npm packages before publishing
published: true
description:
  Some problems with using npm link to test packages, and what I do instead.
tags: npm, javascript, node
cover_image: https://thepracticaldev.s3.amazonaws.com/i/h2jkprv93z4c7b3kqchu.jpg
date: 2018-07-27
---

(image credit:
[Erol Ahmed](https://unsplash.com/photos/9XiN0r2NWSM?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText))

When developing an npm package, you have to confirm that it can actually be
used. It's great if tests pass, examples build, and demos run, but it's broken
if consumers can't install it. npm provides a tool to help test packages before
publishing, npm link.
[The docs explain it very well](https://docs.npmjs.com/cli/link), but a small
example is below. You run it once in your package directory, and again in your
app directory.

```sh
~/workspace/package-name $ npm link
~/workspace/some-application $ npm link package-name
```

This is an excellent option–when it works. `npm link` has been around all the
way back to `npm@1.0`, long before build steps were the norm and browser JS was
a part of npm, and the adoption of these tools has introduced some problems.
There are 3 main problems I've run into.

## Some build tools don't understand symlinks.

Mature build tools typically don't have this problem or have issues with
symlinks discovered and fixed quickly. However, it's a common problem with newly
released tools and one of the more common regressions.
[webpack has special configuration](https://webpack.js.org/configuration/resolve/#resolve-symlinks)
for how to resolve symlinks because of these issues. The documentation
specifically mentions potential problems with npm link.

## Symlinking doesn't verify that you've packaged it correctly.

Even if you've gotten your symlinked package to run correctly, it doesn't tell
you if it will work once you publish it. You only know that all of the files on
your disk will run. A package that has been published to npm is packaged as a
tar archive, and there is some configuration about how it should be packed.
Symlinking doesn't go through that process, leaving you with untested
configuration.

## Module resolution doesn't work with 2 file trees.

Because the package is a symlink, it exists in a different file tree. This
creates a corner case in module resolution–one that breaks React packages. When
a component in your package loads React, it looks up the file tree for a
`node_modules/react` folder and finds only its own–not the one your application
loads. This causes 2 different copies of React to load, which leads to all sorts
of issues.

This is the most damning problem. It's one thing to have tools break
occasionally, but for an entire category of libraries, `npm link` is
fundamentally incompatible. These problems have put me off using `npm link` at
all. I have wasted numerous hours trying to wrangle symlinks for a package I'm
developing and have never gotten it to a point where it's reliable.

Now, I use npm pack.

# npm pack

[The `pack` command](https://docs.npmjs.com/cli/pack) creates a .tgz file
exactly the way it would if you were going to publish the package to npm. It
pulls the name and version from package.json, resulting in a file like
`package-name-0.0.0.tgz`. This can be copied, uploaded, or sent to a coworker.
It's exactly the file that would be uploaded to npm if you published it.

```sh
~/workspace/package-name $ npm pack
```

Once you have the file, you can install it. `npm install` can install from a lot
more sources than just npm, and I highly suggest
[skimming through the docs](https://docs.npmjs.com/cli/install). We have to
specify the full path to the file, so I usually copy it to my home directory
first for convenience.

```sh
~/workspace/package-name $ npm pack
~/workspace/package-name $ cp package-name-0.0.0.tgz ~
~/workspace/some-application $ npm install ~/package-name-0.0.0.tgz
```

You could probably set up an alias or function in your terminal to automate
this, but I don't do it frequently enough to bother. `npm pack | tail -n 1` will
output just the filename to standard out.

This runs through a complete publish cycle–it even runs the `publish` npm script
and the associated pre- and post-scripts. Packing it up and installing it is an
excellent way to simulate publishing a package, and it avoids all of the quirks
and problems of symlinking.

I know when I was first trying to publish packages to npm, one of the hurdles I
faced was figuring out if it would actually work. Publishing feels so final; you
put it up for the world to see and that version number can never be used again.
`npm pack` helps me be more confident that it's going to work the way I expect
it to.

---

Thanks for reading! I'm on Twitter as [@cvitullo](https://twitter.com/cvitullo)
(but most other places I'm vcarl). I moderate
[Reactiflux](http://join.reactiflux.com/), a chatroom for React developers and
[Nodeiflux](https://discordapp.com/invite/vUsrbjd), a chatroom for Node.JS
developers. If you have any questions or suggestions, reach out!
