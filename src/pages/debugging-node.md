---
title: Debugging node without restarting processes
published: true
description:
  I love the Chrome devtools when debugging node.js, but sometimes I
  want to begin debugging a process that is already running. Luckily
  node.js has a way to do so.

tags: javascript, node, debugging
canonical_url: https://hackernoon.com/debugging-node-without-restarting-processes-bd5d5c98f200
date: 2018-01-17
---

I’m typically a frontend developer, but every now and then I find myself
writing or maintaining some backend code. One of the most significant
drawbacks I’ve encountered when switching contexts to Node is the lack
of the Chrome Developer Tools. Not having them really highlights how
hard I lean on them during my day to day in web development. Luckily,
there are options for enabling them, and they’ve gotten much more stable
and usable in recent times. Node has a built in debug mode that allows
you to connect to the DevTools, and there’s a package called
[`node-inspector`](https://github.com/node-inspector/node-inspector)
that connects automatically.

It’s worth noting that versions of Node < 8 use a now-legacy Debugger
API. Node 8 introduces the Inspector API, which better integrates with
existing developer tools.

There’s one common theme that I’ve encountered when using these methods:
they must be invoked when starting the node process. The other day, I
found myself with a process in an odd state that I’ve had trouble
reproducing, and I didn’t want to risk losing it by restarting the
process to enable the inspector.

However, I found a solution — no less, a solution from
[the official Node docs](https://nodejs.org/en/docs/guides/debugging-getting-started/).

> A Node.js process started without inspect can also be instructed to
> start listening for debugging messages by signaling it with SIGUSR1
> (on Linux and OS X).

This only applies to unix based OSes (sorry Windows users), but it saved
my bacon in this case. The `kill` command in unix may be ominously
named, but it can also be used to send arbitrary signals to a running
process. man kill tells me that I can do so using the syntax,
`kill -signal_name pid`. The list of signal names can be enumerated with
`kill -l`, shown below.

```
$ kill -l
hup int quit ill trap abrt emt fpe kill bus segv sys pipe alrm term urg stop tstp cont chld ttin ttou io xcpu xfsz vtalrm prof winch info usr1 usr2
```

By default, `kill` sends an `int`, or an `int`errupt signal, which is
equivalent to hitting `ctrl-c` in a terminal window. There’s a lot of
depth to process signals that I won’t get into (I encourage you to
explore them!), but towards the end of the list is `usr1`. This is the
`SIGUSR1` that the node docs are referring to, so now I just need a pid,
or process ID, to send it to. I can find that by using `ps` and `grep`
to narrow the list of all processing running on my system

```
$ ps | grep node
9670 ttys000 0:01.04 node /snip/.bin/concurrently npm run watch:server npm run watch:client
9673 ttys000 0:00.46 node /snip/.bin/concurrently npm run watch:server-files npm run watch:dist
9674 ttys000 0:33.02 node /snip/.bin/webpack — watch
9677 ttys000 0:00.36 node /snip/.bin/concurrently npm run build:snip — — watch
9678 ttys000 0:01.65 node /snip/.bin/nodemon — delay 2 — watch dist ./dist/src/server.js
9713 ttys000 0:01.00 /usr/local/bin/node ./dist/src/server.js
9736 ttys003 0:00.00 grep — color=auto node
```

My output is a little noisy due to a complex build toolchain that spawns
many processes. But I see down towards the bottom the right process:
`node ./dist/src/server.js`, with a pid of `9713`.

Now I know the signal name is `usr1` and the pid is `9713`, so I need to
run.

```
$ kill -usr1 9713
```

It runs with no output, but I check the logs of my node process and see

```
Debugger listening on ws://127.0.0.1:9229/ad014904-c9be-4288–82da-bdd47be8283b
For help see https://nodejs.org/en/docs/inspector
```

I can open `chrome://inspect`, and I immediately see my inspect target.

![The contents of the chrome://inspect page, with an entry under the "Remote target" heading](https://cdn-images-1.medium.com/max/1600/1*soQHfOEF7G9FGZgqy5vZzQ.png)

I click “inspect”, and I’m rewarded with a Chrome DevTools window in the
context of my node process! I can use the profiler to audit performance,
use the source tab to add break points and inspect the running code, and
use the console to view logs or modify the variables in the current
scope, just like I would on the web.

---

Thanks for reading! I'm on Twitter as
[@vcarl\_](https://twitter.com/vcarl_) (but most other places I'm
vcarl). I moderate [Reactiflux](http://join.reactiflux.com/), a chatroom
for React developers and
[Nodeiflux](https://discordapp.com/invite/vUsrbjd), a chatroom for
Node.JS developers. If you have any questions or suggestions, reach out!
