---
title: Error handling with async/await and promises
published: true
description:
  An exploration of different ways to handle errors with JS promises and
  async/await, with the advantages and problems of each.
tags: javascript, promises, node, error handling
cover_image: https://thepracticaldev.s3.amazonaws.com/i/f8ps8piazdy6vovxg24i.jpg
canonical_url: https://medium.com/p/handling-errors-with-async-await-and-promises-cd2fea534f08
date: 2018-07-21
---

(image credit: [Hunter Newton](https://unsplash.com/photos/vptuRAtlLX4))

I love promises. They're a fantastic model for asynchronous behavior,
and `await` makes it very easy to avoid callback hell (though I'd argue
promises do a great job of that on their own). Once you can build a
mental model for how promises work, you can build some very complex
asynchronous flows in a handful of lines of code.

As much as I love having async/await in my toolbox, there are several
quirks to handling errors when using it. It's very easy to write error
handling in a way that it swallows more errors than you want, and
strategies to work around that negate some of the readability advantages
that async/await brings.

With async/await, a common way to handle errors when awaiting a promise
is to wrap it with a try/catch block. This leads to a relatively
straightforward failure case: if you do anything else inside your `try`
block, any exceptions thrown will be caught.

### Regular async/await

```js
async () => {
  try {
    const data = await fetchData();
    doSomethingComplex(data);
  } catch (e) {
    // Any errors thrown by `fetchData` or `doSomethingComplex` are caught.
  }
};
```

This is an unfortunate interaction between async/await and JS
exceptions. If JS had a mechanism to catch only certain exceptions, we
would be able to describe the errors we want to handle with more
precision. Of course, then we’d be writing Java.

The most obvious solution to this is moving your heavy lifting outside
of the `try` block, but this isn't very satisfying. The flow of data
becomes odd, and you can't use `const` even though there's only 1
assignment.

### Logic extracted from `try` blocks

```js
async () => {
  let data;
  try {
    data = await fetchData();
  } catch (e) {
    // Only errors from `fetchData` are caught.
    return;
  }
  doSomethingComplex(data);
};
```

This code is not particularly pleasant to read and only gets more
unpleasant as you handle more potential edge cases. It also requires
discipline to keep up and has a high potential for accidentally
swallowing errors in the future. Code that requires discipline to
maintain correctly is problematic; human error becomes unavoidable
beyond a certain scale.

Awaiting a promise doesn't make it go away, however. Because there is
still a promise, you can handle errors as you would without awaiting it.

### Await with `.catch()`

```js
async () => {
  const data = await fetchData().catch(e => {
    // Only errors from `fetchData` are caught.
  });
  if (!data) return;
  doSomethingComplex(data);
};
```

This works pretty well, as most of the time error handling is relatively
self-contained. Your success case still benefits from await without the
error handling forcing weird code structure, but it requires you to add
a null check on your data. For more complex async flows, I think this
will be easier to read and more intuitive to write. Null checks are easy
to forget and may introduce bugs that are easy to miss when writing
complex flows.

Because of difficulties handling errors without introducing bugs, _I
prefer to avoid using `async/await` on anything that's going to run in
the browser._ It's an excellent convenience when I don't care about
failure cases, but programming is difficult, and programming when errors
are swallowed is even harder. There are too many pitfalls to put `await`
into wide use.

## What about promises?

When dealing with promises without async/await, the choice for error
handling is more straightforward. There are only 2 choices: `.catch()`,
or the second argument to `.then()`. They have one major difference,
which I made
[a demo for a few weeks ago](https://codesandbox.io/s/j45mmo2rmw).

### Promises with `.catch()`

```js
() => {
  fetchData()
    .then(data => {
      doSomethingComplex(data);
    })
    .catch(err => {
      // Errors from `fetchData` and `doSomethingComplex` end up here.
    });
};
```

This has the same problem as our first try/catch block–it handles errors
overzealously. Eventually, when I make a typo while editing
`doSomethingComplex`, I'll lose time because I don't see the error.
Instead, I prefer to use the error argument to `.then()`.

```js
  fetchData()
    .then(
      data => {
        doSomethingComplex(data);
      },
      err => {
        // Only errors from `fetchData` are caught.
      }
    );
};
```

I rarely use `.catch()`. I want errors from within my success case to
propagate up to where I can see them. Otherwise, any problems during
development will be swallowed, increasing the odds that I ship a bug
without realizing it.

However, I prefer to handle errors very precisely. I prefer to have bugs
surface so that they can be observed and fixed. Stopping errors from
propagating may be desirable, if you want the UI to keep chugging
through any problems it encounters. Be aware, doing so means only
serious failures will be logged.

## Other problems with promises

A significant "gotcha" that I've run into with promises is that _thrown
errors within a promise will always cause a rejection._ This can be a
problem if you’re developing an abstraction over some kind of external
data. If you assume that your promise rejection handler only has to
handle network errors, you’ll end up introducing bugs. Non-network
exceptions won’t make it to your bug tracking tools or will lose
important context by the time they do.

```js
const fetchData = () =>
  requestData().then(({ data }) =>
    // What if `removeUnusedFields` throws?
    // It could reference a field on `undefined`, for example.
    data.map(removeUnusedFields),
  );

//
fetchData().then(handleSuccess, err => {
  // This code path is called!
});
```

This is just how promises behave, but it’s bitten me a few times during
development. There isn’t an easy fix for it, so it’s just a case to keep
in mind during development. It’s not likely to occur spontaneously in
production, but it can cost you time when you’re editing code.

There are always some unknowns when you’re writing code, so it’s safe to
assume your error handling will eventually be run with something that it
isn’t designed to handle. Imprecise error handling has significant costs
in productivity and number of bugs shipped. I encountered an example
recently when editing a complex series of asynchronous tasks that used
await with try/catch. It threw in the last function call in the try,
executing both the success and failure code paths. It took me a while to
notice the behavior, and longer to understand why it was happening.

Overall, there are a number of ways that promises can put you into a bad
position to handle errors. Understanding how errors will or won’t
propagate will help you write code that tolerates faults better. It’s a
fine line to tread between handling errors properly and avoiding
[overly defensive code](https://medium.com/@vcarl/overly-defensive-programming-e7a1b3d234c2)
but it's one that will pay dividends in the long run.

Looking forward, there is a proposal to add
[pattern matching](https://github.com/tc39/proposal-pattern-matching)
(it’s [stage 1](https://tc39.github.io/process-document/) at time of
writing) that would provide a powerful tool for precisely handling
errors. Given the varied ways of describing errors used in different
parts of the JS ecosystem, pattern matching looks to be an excellent way
of describing them.

For more reading about promises, I recommend
[this post by Nolan Lawson](https://pouchdb.com/2015/05/18/we-have-a-problem-with-promises.html)
that was sent to me in response to an earlier draft of this post.
Interestingly, he suggests avoiding handling errors in `.then()`,
favoring `.catch()`, and it's good to read different perspectives. It
talks much more about composing promises together, something I didn't
touch on at all.

---

Thanks for reading! I'm on Twitter as
[@vcarl\_](https://twitter.com/vcarl_) (but most other places I'm
vcarl). I moderate [Reactiflux](http://join.reactiflux.com/), a chatroom
for React developers and
[Nodeiflux](https://discordapp.com/invite/vUsrbjd), a chatroom for
Node.JS developers. If you have any questions or suggestions, reach out!
