---
title: Optimizing a dockerfile
published: true
description: >
  There are 3 major points to consider when optimizing a Docker file:
  Build context size, cached layers, and final image size.

tags: docker, programming, optimizing
cover_image:
date: 2020-08-05
---

There are 3 major points to consider when optimizing a Docker file:

- Build context size
- Cached layers
- Final image size

# Build context size

The build context is the entirety of the disk contents for the folder
containing your Dockerfile, except parts ignored by `.dockerignore`.
This can be massive — on a Javascript application, this means copying
over `node_modules`, which would be installed as part of the build
anyway!

On a real world example, failing to add `node_modules` to my
`.dockerignore` file yields:

`Sending build context to Docker daemon 788.6MB`

That context transfers at about 30-50MB/s. A significant wait! _Just_
ignoring `node_modules` reduces that to:

`Sending build context to Docker daemon 13.75MB`

Which is no wait at all. This alone is an easy win that can save minutes
per build if not already configured.

# Cached layers

Each step in a Dockerfile produces a "layer," which is cached across
subsequent runs. The rules for when caches are invalidate are pretty
simple:

- The line of the Dockerfile is changed
- The resources referenced by `ADD` or `COPY` change
- Any line above the current one has been invalidated

This means that we can dramatically reduce the amount of time it takes
to re-build a docker image by approaching our Dockerfile with some care.

## Order commands from least- to most-frequently-changed

We can maximize the amount of layers that remain cached by placing
frequently changed resources or instructions later in the file. This is
constrained, though, by the process having a necessary order of
operations. You can't install your dependencies before copying a
manifest, and you can't build your source before installing your
dependencies.

## Un-bundle unrelated instructions

Instead of configuring the OS, installing the dependencies, and building
the application in a single step, separate these into discrete steps.
Pulling from a real Dockerfile I optimized,

```dockerfile
FROM ubuntu:16.04

WORKDIR /app/src

COPY . /app/src
RUN apt-get update && apt-get install -y curl git make … && apt-get clean
RUN yarn install && yarn build

# …
```

Every time a file anywhere in your project changes, this will start from
square 1. `COPY . /app/src` is telling it to do exactly that.

```dockerfile
FROM ubuntu:16.04

WORKDIR /app/src

RUN apt-get update && apt-get install -y curl git make … && apt-get clean

COPY package.json yarn.lock /app/src/
RUN yarn install

COPY .babelrc webpack.config.js /app/src/
COPY src /app/src/src

RUN yarn build
```

This again can cut minutes per build off the total time spent. Breaking
down the steps:

- Install OS-level dependencies. These are specified inline, so it will
  never invalidate unless I edit this line of the Dockerfile.
- Copy my package information and lockfile
- Install dependencies. This step will only invalidate if one of the
  specified files changes.
- Copy source code and build configuration
- Build the app. This invalidates on every code change.

`COPY` has an awkward experience for this. Files may be copied many at
once with the final item in the list being interpreted as the in-image
destination folder, but source folders must be specified 1 per `COPY`
command. Folders are also specified not by the _containing_ folder, but
by the exact folder itself (note `COPY src /app/src/src`, not
`COPY src /app/src`). This leads to some extra layers in complex
directory structures, but the advantages of this are huge.

Consider how long each of these steps takes. I find `apt-get` and
`yarn install` frequently take anywhere from 30 seconds to multiple
minutes, _each_, and both are completely irrelevant if I'm only making a
change to source code.

# Final image size

The final docker image is, presumably, the artifact that is being
produced and passed throughout the rest of the deployment. These may be
archived for accountability purposes, uploaded across a network, or
otherwise be used in situations where keeping them small is
advantageous. Some context first:

The real-world Dockerfile I've been referencing is a single-page
application, and thus is served by nginx. A straightforward way to
configure a docker image for this would be to start `FROM nginx`,
install node, yarn, and all the other tools needed to build it, then
copy the resulting files to nginx's content root.

However this leads to an inefficiency: node, yarn, even my
`node_modules`, _aren't used by nginx_. It's compiled into static html,
js, and css. The rest of those tools and resources are now wasted space.
Worse, it's a potential security risk! The running server, rather than
only having exactly what it needs to execute the production environment,
has multiple tools for installing and running external code. (I'll admit
to not knowing a precise exploit — security isn't my specialization —
but excluding unnecessary tools reduces the attack surface)

Docker lets us address that with a feature known as "multi-stage
builds." We can name intermediate images used to run our build, then
extract resources for consumption in a later (more narrowly scoped)
image.

```dockerfile
FROM ubuntu:16.04

WORKDIR /app/src

RUN apt-get update && apt-get install -y curl git make … && apt-get clean

COPY package.json yarn.lock /app/src/
RUN yarn install

COPY .babelrc webpack.config.js /app/src/
COPY src /app/src/src

RUN yarn build

# I’m cheating a bit. These two images aren’t _identical_ because I
# don't have a working example of nginx handy. The installation and
# execution of nginx is omitted here.
```

The above dockerfile produces an image that's 2.21GB. I can mke this a
multi-stage build by naming our "build" image and using a second `FROM`.

```dockerfile
FROM ubuntu:16.04 as build

WORKDIR /app/src

RUN apt-get update && apt-get install -y curl git make … && apt-get clean

COPY package.json yarn.lock /app/src/
RUN yarn install

COPY .babelrc webpack.config.js /app/src/
COPY src /app/src/src

RUN yarn build

# Our final image source
FROM nginx:1.17

COPY --from=build /app/src/dist/ /usr/share/nginx/html/
COPY nginx_default.conf /etc/nginx/conf.d/default.conf
```

The multi-stage build version produces an image that's 166MB. That's
less than one tenth the size! There's surely some additional fat to trim
there, as the
[nginx base images](https://hub.docker.com/_/nginx?tab=tags) are about
50MB and my built static files are only about 40MB, but this is quite an
improvement over the simplest configuration without spending too much
time.

---

I've repeated this process on a number applications I've maintained, and
it's paid dividends in time saved every time. Time spent waiting for a
build is waste time. It breaks me out of my flow, I get distracted and
don't notice when it finally finishes, and it makes it so slow to test
changes that I don't want to experiment. Optimizatios such as these are
substantial wins to my productivity.
