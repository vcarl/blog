---
title: Overly defensive programming
published: true
description:
  When you're guarding against errors, have you considered what might
  cause those failures? If you add checks “just to be safe” you may be
  writing overly defensive code.

tags: javascript, node, error handling, fail fast
cover_image: https://cdn-images-1.medium.com/max/1600/1*1FzBa_mHElrOQiFoPPD8Fw.jpeg
canonical_url: https://medium.com/@vcarl/overly-defensive-programming-e7a1b3d234c2
date: 2018-02-16
---

([I also presented this as a talk at a local meetup!](https://www.youtube.com/watch?v=cgGN7k-xJBo))

I recently asked a coworker why a certain check was being done, and he
answered with a shrug and said, “Just to be safe.” Over my career, I’ve
seen a lot of code written just to be safe. I’ve written a lot of that
code myself! If I wasn’t sure if I could rely on something, I’d add a
safety check to prevent it from throwing an exception.

To give some examples, I mean idioms like providing unnecessary default
values.

```js
axios.get(url).then(({ data }) =>
 // If the response doesn't have a document, use an empty object
 this.setState({ document: data.document || {} });
})
```

Or checking that each key exists in deeply nested data.

```js
render() {
  const { document } = this.state;
  const title = document &&
  document.page &&
  document.page.heading &&
  document.page.heading.title;
  return <h1>{title}</h1>
}
```

And many other idioms. Idioms like these prevent exceptions from being
thrown. Used without care, suppressing an exception is like hanging art
over a hole in the wall.

<iframe src='https://gfycat.com/ifr/ObesePortlyAnemonecrab' frameborder='0' scrolling='no' width='100%' height='385px'></iframe>

At a glance, there doesn’t appear to be a problem. But you haven’t
patched the hole and you haven’t fixed the bug. Instead of an
easy-to-trace exception, you have unusable values—bad data—infiltrating
your program. What if there’s a bad deployment on the backend and it
begins returning an empty response? Your default value gets used, your
chain of `&&` checks returns `undefined`, and the literal string
‘undefined’ gets put on your page. In React code, it won’t render
anything at all.

There’s an adage in computing, “be liberal in what you accept and
conservative in what you send.” Some might argue that these are examples
of this principle in action, but I disagree. I think these patterns,
when used to excess, show a lack of understanding of what guarantees
your libraries and services provide.

## Data or arguments from third parties

What your code expects from somebody else’s code is a contract. Often,
this contract is only implied, but care should be taken to identify what
form the data take and to document it. Without a well understood,
clearly documented response format from an API, how can you tell whose
code is in error when something breaks? Having a clear definition builds
trust.

When you request data from an external HTTP API, you don’t need to
inspect the response object to see if it has data. You already know that
it exists because of the contract you have with your request library.
For a specific example, the axios documentation defines a schema for the
format the response comes back with. Further, you should know the shape
of the data in the response. Unless the request is stateful or
encounters an error, you’ll get the same response every time—this is the
contract you have with the backend.

## Data passed within the application

The functions you write and the classes you create are also contracts,
but it’s up to you as a developer to enforce them. Trust in your data,
and your code will be more predictable and your failure cases more
obvious. Data errors are simpler to debug if an error is thrown close to
the source of the bad data.

Unnecessary safety means that functions will continue to silently pass
bad data until it gets to a function that isn’t overly safe. This causes
errors to manifest in a strange behavior somewhere in the middle of your
application, which can be hard to track with automated tools. Debugging
it means tracking the error back to find where the bad data was
introduced.

I’ve set up [a code sandbox](https://codesandbox.io/s/01o0wq53zl) with
an example of overly safe and unsafe accesses.

```js
const initialStuff = {
  things: {
    meta: {
      title: "I'm so meta, even this acronym",
    },
  },
};
// And within each component,
handleClick = e => {
  if (this.state.stuff) {
    this.setState({ stuff: null });
  } else {
    this.setState({ stuff: initialStuff });
  }
};
```

The “safe” component guards against exceptions being thrown.

```js
const { title } =
  (this.state.stuff &&
    this.state.stuff.things &&
    this.state.stuff.things.meta) ||
  {};
```

And the unsafe one gets the values without any checks.

```js
const { title } = this.state.stuff.things.meta;
```

This approximates what could happen if an external API starts returning
unusable data. Which of these failure modes would you rather diagnose?

<iframe src='https://gfycat.com/ifr/MellowSkeletalAustralianfurseal' frameborder='0' scrolling='no' allowfullscreen width='100%' height='300px'></iframe>

## Performance and development speed

Beyond that, conditionals aren’t free. Individually, they have little
impact on performance, but codebase that makes a widespread habit of
doing unnecessary checks will begin to use an observable amount of time.
The impact can be significant: React’s production mode removes prop
types checks for a significant performance increase. Some benchmarks
show production mode in React 15 getting a 2–4x boost over development
mode.

Conditional logic adds mental overhead as well, which affects all code
that relies on the module. Being overly cautious with external data
means that the next person to consume it doesn’t know if it’s
trustworthy, either. Without digging into the source to see how
trustworthy the data is, the safest choice is to treat it as unsafe.
Thus the behavior of this code forces other developers to treat it as an
unknown, infecting all new code that’s written.

# Fixing the problem

When writing code, take a minute to think through the edge cases.

- What kinds of errors might happen? What would cause them?
- Are you handling the errors you can foresee?
- Could the error occur in production, or should it be caught during
  development?
- If you provide a default value, can it be used correctly downstream?

Many of the fixes to patterns like this are to handle the errors you can
and to throw the errors you can’t. It makes sense to verify that data
from an external API comes back in the shape you’re expecting, but if it
doesn’t, can your app realistically continue? Lean on your error
handling to show an appropriate response to the user, and your error
logging to notify you that there’s an issue.

Learning what to expect from your tools is a large part of writing code
you can trust. Many times this is documented explicitly, but sometimes
it’s only implied. The format of data with a backend API is up to
whoever’s writing that backend. If you’re full-stack, great news! You
control both ends, and you can trust yourself (right?). If a separate
team controls the backend API, then you’ll need to establish what is
correct behavior and hold each other to it. A third party API can be
harder to trust, but you’ll also have minimal influence over what it
returns.

When writing React components, you have an even more powerful tool:
PropTypes. Instead of scattering checks like
`a && a.b && a.b.c && typeof a.b.c === 'function' && a.b.c()`, you can
add a type definition as a static property.

```js
Thing.propTypes = {
  a: PropTypes.shape({
    b: PropTypes.shape({ c: PropTypes.func.isRequired }).isRequired,
  }).isRequired,
};
```

This might look a little ugly, but now the component will log an error
during development if your data is wrong. The missing data will likely
cause its own error to throw afterward, and which of these messages is
more helpful?

```
Warning: Failed prop type: The prop 'a' is marked as required in 'Thing', but its value is 'undefined'.

// or

Uncaught TypeError: Cannot read property 'b' of undefined
```

External data that changes Of course, sometimes you will have data that
you’re not sure about. It might have keys `a, b, c` or `x, y, z`, or the
data key might be `null`. These are good times to add checks, but
consider defining them as functions that communicate their intent.

```js
const hasDataLoaded = data => typeof data !== 'undefined';

hasDataLoaded(data) && data.map(/* … */);
```

Well named functions will tell your coworkers down the road why these
checks are present. Particularly good names will enable them to make the
checks more accurate in the future.

Excessively safe idioms—and even well-considered checks—amount to
stopgaps to guard against type errors. PropTypes are easy to add to an
existing React codebase but aren’t the only option available. TypeScript
and Flow are much more advanced tools to verify your data types.
PropTypes will save you at runtime, but either TypeScript or Flow will
allow you to verify that your code works at build time. Types give you
an ironclad contract in your code: if you’re not using your data
correctly, it won’t even build!

Types aren’t everyone’s jam, but they’ve grown on me for widely shared,
highly complex, or difficult-to-change parts of the code. For the rest
of the code, in React at least, PropTypes will help you catch errors
more quickly and have more confidence in your codebase.

When a developer does something “just to be safe,” it’s a hint that
there’s an unrecognized unknown. Ignoring these hints can cause small
problems to accumulate into large problems. Know what errors you want
when you’re making changes, how to guard against those you don’t, and
learn to trust your code.
