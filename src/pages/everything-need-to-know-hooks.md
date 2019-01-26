---
title: Everything you need to know about React Hooks
published: true
description:
  React announced new features that will change the way React code is written.
  Here's what you need to know.
tags: react, javascript
cover_image: https://thepracticaldev.s3.amazonaws.com/i/b68cz999l5ti5a6bcihz.jpg
canonical_url: https://medium.com/@vcarl/everything-you-need-to-know-about-react-hooks-8f680dfd4349
date: 2018-10-25
---

React just announced a new feature:
[Hooks](https://reactjs.org/docs/hooks-overview.html). It's a brand new set of
APIs that enables powerful new ways to share stateful logic between components,
optimize performance without significant rewrites, get some of the benefits of
Redux-style separation of concerns, and more. They also deliver on a promise
that the React team made years ago—stateful function components. Using state
from function components came up as a possibility in
[Dan Abramov's Q&A on Reactiflux](https://www.reactiflux.com/transcripts/dan-abramov/)
all the way back in April 2016.

![Screenshot of Dan Abramov's Q&A transcript. The highlighted section reads, "We might add functional stateful components later that might allow this, but this is distant future."](https://i.imgur.com/vIcMPdc.png)

It's been a long time coming, but they're here! More than just state, though,
there are 11 new functions in all that should enable the full range of
functionality that we use classes and the lifecycle for today.

- `useState`
- `useEffect`
- `useContext`
- `useCallback`
- `useMemo`
- `React.memo` (Not a hook, but new)
- `useReducer`
- `useRef`
- `useLayoutEffect`
- `useImperativeMethods`
- `useMutationEffect`

Let's take a look at what each of them is for.

## `useState`

Stateful function components are enabled with the new function `useState`.

```js
import { useState } from 'react';

const SomeComponent = props => {
  const [state, setState] = useState(initialState);
  return (
    <div>
      {state}
      <input onChange={e => setState(e.target.value)} />
    </div>
  );
};
```

If you ever used the library `recompose`, this API may look familiar. `useState`
takes an initial state as an argument, and returns the current state and an
updater function. The `setState` it returns is _almost_ the same used by class
components—it can accept a callback that gets the current state as an argument,
but it doesn't automatically merge top-level object keys.

Each call to `useState` is paired with a component, with its state persisting
across renders. This means that you can call `useState` multiple times within a
single function component to get multiple independent state values. Because the
`setState` returned isn't scoped to a single component, we can define stateful
behaviors independent of the component. This enables powerful new ways to
abstract stateful logic.

Let's look at an example that I've run into on several projects: managing sort
state in several components. I find the APIs that table components expose to be
inflexible, so I tend to write tables of data as one-offs. My current project
has some code for managing what key to sort against, and in which direction,
copy-pasted into several different components. With `useState`, we gain the
ability to define it as a separate module.

```js
const useSort = (someArray, initialSortKey) => {
  const [state, setState] = useState({
    isAscending: false,
    sortKey: initialSortKey,
  });

  // Let's pretend `makeSortComparator` exists for simplicity
  const comparator = makeSortComparator(state);
  const sortedData = someArray.slice().sort(comparator);

  return {
    ...state,
    sortedData,
    toggleAscending: () =>
      setState(state => ({
        ...state,
        isAscending: !state.isAscending,
      })),
    setSortKey: sortKey => setState(state => ({ ...state, sortKey })),
  };
};
```

Now we have a reusable method to use in our data table components. We have a
simple API we can use across our many different tables, with each component
working off its own separate state.

```js
const SomeTable = ({ data }) => {
  const { sortedData, ...sortControls } = useSort(data, 'id');
  return (
    <table>
      <TableHeading {...sortControls} />
      <tbody>
        {sortedData.map(datum => (
          <TableRow {...datum} />
        ))}
      </tbody>
    </table>
  );
};
```

Please note: the React team strongly recommends prefixing the names of these
types of modules with `use` so there's a strong signal of what kind of behavior
it provides. See [the full docs](https://reactjs.org/docs/hooks-custom.html) for
more about writing your own hooks.

I am super excited about this new way to share functionality. It's much more
lightweight than a HOC in all ways; less code to write, fewer components to
mount, and fewer caveats. Check out the
[API documentation](https://reactjs.org/docs/hooks-reference.html#usestate) for
all the details.

## `useEffect`

A lot of components have to kick off different types of effects as part of
mounting or re-rendering. Fetching data, subscribing to events, and imperatively
interacting with another part of the page are all common examples of this. But
the code for handling these types of effects ended up scattered across
`componentDidMount`, `componentDidUpdate`, and `componentWillUnmount`.

If you wanted to run the same effect when a prop changed, you either had to add
a mess of comparisons in `componentDidUpdate` or set a `key` on the component.
Using a `key` simplifies your code, but it scatters control of effects into
another file—completely outside the component's control!

`useEffect` simplifies all these cases. Imperative interactions are simple
functions run after each render.

```js
const PageTemplate = ({ title, children }) => {
  useEffect(() => {
    document.title = title;
  });
  return (
    <div>
      <h1>{title}</h1>
      {children}
    </div>
  );
};
```

For data fetching and other interactions you don't want to happen unnecessarily,
you can pass an array of values. The effect is only run when one of these
changes.

```js
const ThingWithExternalData = ({ id, sort }) => {
  const [state, setState] = useState({});
  useEffect(
    () => {
      axios
        .get(`/our/api/${id}?sortBy=${sort}`)
        .then(({ data }) => setState(data));
    },
    [id, sort],
  );
  return <pre>{JSON.stringify(state, null, 2)}</pre>;
};
```

Subscriptions and other effects that require some kind of cleanup when the
components unmount can return a function to run.

```js
const ThingWithASubscription = () => {
  const [state, setState] = useState({});
  useEffect(() => {
    someEventSource.subscribe(data => setState(data));
    return () => {
      someEventSource.unsubscribe();
    };
  });
  return <pre>{JSON.stringify(state, null, 2)}</pre>;
};
```

This is so powerful. Just like with `useState`, they can be defined as separate
modules—not only does this put all the code required for these complex effects
in a single location, _they can be shared across multiple components_. Combined
with `useState`, this is an elegant way to generalize logic like loading states
or subscriptions across components.

## `useContext`

The context API is great and was a significant improvement in usability compared
to what existed before. It advanced context from a "you probably shouldn't use
this" warning in the docs to an accepted part of the API. However, context can
be cumbersome to use. It has to be used as a render prop, which is a pattern
that doesn't compose gracefully. If you need values out of multiple different
render props, you quickly end up indented to the extreme.

`useContext` is a substantial step forward. It accepts the value created by the
existing `React.createContext` function (the same one you would pull `.Consumer`
off to use as a render prop) and returns the current value from that context
provider. The component will rerender whenever the context value change, just
like it would for state or props.

```js
// An exported instance of `React.createContext()`
import SomeContext from './SomeContext';

const ThingWithContext = () => {
  const ourData = useContext(SomeContext);
  return <pre>{JSON.stringify(ourData, null, 2)}</pre>;
};
```

This gets rid of my final complaint with context. This API is simple and
intuitive to the extreme and will be a powerful way to pipe state around an
application.

# More advanced hooks

The 3 hooks mentioned above are considered to be the basic hooks. It's possible
to write entire applications using only `useState`, `useEffect`, and
`useContext`--really, you could get away with just the first two. The hooks that
follow offer optimizations and increasingly niche utility that you may never
encounter in your applications.

## `useCallback`

React has a number of optimizations that rely on props remaining the same across
renders. One of the simplest ways to break this is by defining callback
functions inline. That's not to say that defining functions inline will cause
performance problems--in many cases, it has no impact. However, as you begin to
optimize and identify what's causing frequent re-renders, you may find inline
function definitions to be the cause of many of your unnecessary prop change.

In the current API, changing an inline function to something that won't change
across renders can be a significant change. For function components, it means
rewriting to a class (with all the changes that entails) and defining the
function as a class method. `useCallback` provides a simple way to optimize
these functions with minimal impact on your code by memoizing a function
provided to it. Just like `useEffect`, we can tell it what values it depends on
so that it doesn't change unnecessarily.

```js
import doSomething from './doSomething';

const FrequentlyRerenders = ({ id }) => {
  return (
    <ExpensiveComponent onEvent={useCallback(() => doSomething(id), [id])} />
  );
};
```

This is another exciting improvement in usability. What used to mean a
significant rewrite of a component can now be accomplished in-place with a
function directly from React.

## `useMemo`

On the subject of optimizations, there's another hook that has me excited. Many
times, I need to calculate derived data from the props I provide a component. It
may be mapping an array of objects to a slightly different form, combining an
array of data to a single value, or sorting or filtering. Often `render` is the
logical place for this processing to happen, but then it will be run
unnecessarily whenever other props or state change.

Enter `useMemo`. It's closely related to `useCallback`, but for optimizing data
processing. It has the same API for defining what values it depends on as
`useEffect` and `useCallback`.

```js
const ExpensiveComputation = ({ data, sortComparator, filterPredicate }) => {
  const transformedData = useMemo(
    () => {
      return data.filter(filterPredicate).sort(sortComparator);
    },
    [data, sortComparator, filterPredicate],
  );
  return <Table data={data} />;
};
```

I'm excited about this for many of the same reasons as `useCallback`.
Previously, optimizing this type of processing typically meant extracting the
logic to a separate function and memoizing that. Because it's common practices
for memoization tools to rely on a functions _arguments_ for invalidating
memoization, that meant creating a pure function. This refactoring can end up
being too substantial, so only the most extreme performance problems end up
being addressed. This hook should help avoid the "death by a thousand cuts" type
of performance problems.

## `React.memo`

This isn't a hook, but it's a new API and an important optimization. Memoizing
calculations and ensuring props don't change unnecessarily are good for
performance, but both are more effective when combined with the
`shouldComponentUpdate` or `PureComponent` features—neither of which is
available for function components.

`React.memo` is a new function that enables behavior similar to `PureComponent`
for functions. It compares prop values and only re-renders when they change. It
doesn't compare state or context, just like PureComponent. It can accept a
second argument so you can do custom comparisons against props, but there's an
important difference from `shouldComponentUpdate`: it only receives props.
Because `useState` doesn't provide a single state object, it can't be made
available for this comparison.

## `useReducer`

This hook has interesting implications for the ecosystem. The reducer/action
pattern is one of the most powerful benefits of Redux. It encourages modeling UI
as a state machine, with clearly defined states and transitions. One of the
challenges to using Redux, however, is gluing it all together. Action creators,
which components to `connect()`, `mapStateToProps`, using selectors,
coordinating asynchronous behavior... There's a whole menagerie of associated
code and libraries on top of Redux that can overwhelm.

`useReducer`, combined with the usability improvements to context, new
techniques for memoizing calculations, and the hooks for running effects, allow
for many of the same benefits as Redux with less conceptual overhead. I
personally have never been bothered by the supposed boilerplate problem that
Redux has, but considering how these hooks will combine has me excited for how
features could be defined and scoped within an application.

## `useRef`

Sometimes when writing components, we end up with information that we need to
keep track of but don't want to re-render when it changes. The most common
example of this is references to the DOM nodes we've created, for instance, an
`input` node that we need to track the cursor position for or imperatively
focus. With class components we would track assign them directly to properties
on `this`, but function components don't have a context we can reference that
way.

`useRef` provides a mechanism for these cases. It creates an object that exists
for as long as the component is mounted, exposing the value assigned as a
`.current` property.

Directly from [the docs](https://reactjs.org/docs/hooks-reference.html#useref)
(and
[the FAQ](https://reactjs.org/docs/hooks-faq.html#is-there-something-like-instance-variables):

```js
// DOM node ref example
function TextInputWithFocusButton() {
  const inputEl = useRef(null);
  const onButtonClick = () => {
    // `current` points to the mounted text input element
    inputEl.current.focus();
  };
  return (
    <>
      <input ref={inputEl} type="text" />
      <button onClick={onButtonClick}>Focus the input</button>
    </>
  );
}

// An arbitrary instance property
function Timer() {
  const intervalRef = useRef();

  useEffect(() => {
    const id = setInterval(() => {
      // ...
    });
    intervalRef.current = id;
    return () => {
      clearInterval(intervalRef.current);
    };
  });
}
```

This code is more verbose than using instance properties is in class components,
but it should be relatively infrequent that you need to store values in this
way.

# Rarely used hooks

The hooks mentioned above have covered all the use cases that I've encountered
when writing applications. Reading through the docs of the remaining hooks, I
understand why they exist and I'm sure that I'm using libraries that will
implement them, but I don't anticipate using them myself in application code.

## `useLayoutEffect`

If I use any of these 3, I anticipate it will be `useLayoutEffect`. This is the
hook recommended when you need to read computed styles after the DOM has been
mutated, but before the browser has painted the new layout.

Crucially, this gives you an opportunity to apply animations with the least
chance of visual artifacts or browser rendering performance problems. This is
the method currently used by
[react-flip-move](https://github.com/joshwcomeau/react-flip-move), an amazing
transition library when items change position, but there might be situations
where I need to use this myself.

## `useImperativeMethods`

To the best of my knowledge, this hook is a counterpart to `forwardRef`, a
mechanism for libraries to pass through the `ref` property that would otherwise
be swallowed. This is a problem for component libraries like Material UI, React
Bootstrap, or CSS-in-JS tools like styled-components, but I haven't run into a
case where I needed to solve this problem myself.

## `useMutationEffect`

This is the hook I'm having the hardest time wrapping my head around. It's run
immediately before React mutates the DOM with the results from `render`, but
`useLayoutEffect` is the better choice when you have to read computed styles.
The docs specify that it runs before sibling components are updated and that it
should be used to perform custom DOM mutations. This is the only hook that I
can't picture a use case for, but it might be useful for cases like when you
want a different tool (like D3, or perhaps a canvas or WebGL renderer) to take
over the actual rendering of output. Don't hold me to that though.

# In conclusion

Hooks have me excited about the future of React all over again. I've been using
this tool since 2014, and it has continually introduced new changes that
convince me that it's the future of web development. These hooks are no
different, and yet again substantially raise the bar for developer experience,
enabling me to write durable code, and improve my productivity by extracting
reused functionality.

I thought Suspense was the only upcoming feature that I'd be excited for in
2018, but I'm happy to be proven wrong! Combined, I expect that React
applications will set a new bar for end-user experience and code stability.

---

Thanks for reading! I'm on Twitter as [@cvitullo](https://twitter.com/cvitullo)
(but most other places I'm vcarl). I moderate
[Reactiflux](http://join.reactiflux.com/), a chatroom for React developers and
[Nodeiflux](https://discordapp.com/invite/vUsrbjd), a chatroom for Node.JS
developers. If you have any questions or suggestions, reach out! Cover image is
from [rawpixel on Unsplash](https://unsplash.com/photos/kAwqA_yB_Fk)
