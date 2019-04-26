---
title: Highly complex forms with Formik
date: 2019-04-24
updated:
description:
  I fell deeper in love with Formik after building the most complex form
  I've encountered.
tags: javascript, react, formik
cover_image: https://i.imgur.com/rLxAGsz.jpg
---

(Image credit:
[Leonel Fernandez](https://unsplash.com/photos/REZp_5-2wzA))

Formik is a wonderful library. When combined with the Yup validation
library, it becomes almost trivial to handle touched inputs and
validation—even with large forms with many different types of fields.

I recently used Formik and Yup to implement the most complex form I've
seen first-hand; a tool for constructing
[Stellar transactions](https://www.stellar.org/developers/guides/concepts/transactions.html).
(There's a demonstration video at the bottom of this post) Transactions
on Stellar are composed of 3 main parts: the transaction body, 1 or more
signatures, and up to 200
[operations](https://www.stellar.org/developers/guides/concepts/operations.html),
of which there are 12 different types with between 1 and 10 properties.
At a (very) high level, this form needed:

- A main form for the transaction
- Several signatures, each a plain string
- Multiple operations, each a different complex object

I also wanted to have the operations behave like a "sub-form," being
added to the transaction when a user presses enter. This meant I was
looking at doing two patterns that I'd specifically struggled with in
the past. I've found both sub-forms and an arbitrary number of inputs
tricky to implement—with the complex schema of my arbitrary number of
sub-forms, I was nervous. To my delight, I found Formik's included
utilities vastly simplified the implementation.

# Creating a sub-form

The fundamental problem with a sub-form is that HTML doesn't allow
`<form>` to appear within another `<form>` node. I wanted my transaction
form to contain the operation forms before the 'Submit transaction'
button;

```
+------------------------+
| [ source ]             |
| [ memo ]               |
|                        |
| { operation form 1 }   |
| { operation form 2 }   |
|                        |
| { signer form 1 }      |
| { signer form 2 }      |
|                        |
| < submit transaction > |
+------------------------+
```

Formik provides such an effective abstraction over HTML forms, though,
that this problem became trivial to solve. Because Formik provides a
`submitForm` function to the render callback, it's easy to imperatively
trigger a form submission from outside the form. By changing from a true
submit button to a regular button that submits on click, I can get the
behavior I want.

```js
// To simplify, I've removed some of the normal wiring needed to make
//this a working example.
() => (
  <Formik
    // initialValues etc
    render={({ submitForm }) => (
      <>
        <form>
          <input name="source" />
          <input name="memo" />
        </form>
        <form>
          <input name="operation 1" />
        </form>
        <form>
          <input name="operation 2" />
        </form>
        <form>
          <input name="signature 1" />
        </form>
        <form>
          <input name="signature 2" />
        </form>
        <button onClick={submitForm}>Submit transaction</button>
      </>
    )}
  />
);
```

With this, I got the behavior I was seeking. On the page it appears as a
single form, submitted as a single unit once it's completed. Each
operation, meanwhile, can be attached to the transaction itself when its
portion of the form is submitted.

I discovered several footguns in this naive implementation.

- Difficult to tell when an operation had been attached to the
  transaction.
- Easy to submit a transaction before attaching the last operation.

I adjusted the behavior in 2 ways in response. I changed operations to
display as text (rather than inputs) after being attached, with a button
to change to an edit mode. I also blocked submission of the main form
while a sub-form was being edited. These changes dramatically cut the
number of errors I made while manually testing. I wanted to call out
these problems specifically because they seemed like likely problems
when following this pattern.

# Lists of inputs

The signatures for the transaction are simple strings, but there can be
up to 20 of them. Dealing with lists in forms introduces a lot more
complexity. Tracking which index to update, adding new elements, and
removing existing elements all add logic.

Formik, luckily, provides a utility specifically to help in this case;
`FieldArray`. It provides
[a number of typical array methods](https://jaredpalmer.com/formik/docs/api/fieldarray#fieldarray-helpers),
which made it trivial to handle this situation that I had previously
found so frustrating.

```js
<FieldArray
  name="signers"
  render={({ push, remove, replace }) => (
    <form>
      {values.signers.map((signer, i) => (
        <>
          <input
            key={i}
            // Replace this value on change.
            onChange={e => replace(i, e.target.value)}
            // Formik is smart enough to understand indexes in input names.
            name={`signers.${i}`}
            value={signer}
          />
          <button type="button" onClick={() => remove(i)}>
            Remove
          </button>
        </>
      ))}
      <button type="button" onClick={() => push('')}>
        Add signer
      </button>
    </form>
  )}
/>
```

There are many other array utilities, but these three simple ones were
sufficient for my needs. My final code grew much more complex as I
fine-tuned the UX I wanted to offer the user (largely discovered through
mistakes I found myself making), but the core of it is quite simple.

# Lists of many different complex inputs

Happily, Formik provides such fantastic handling of input names when
determining changes, I found no additional complexity when the lists
were made of complex objects.

```js
<FieldArray
  name="operations"
  render={({ push, remove, replace }) => (
    <form>
      {values.operations.map((operation, i) => (
        <>
          <input
            key={i}
            onChange={e => replace(i, e.target.value)}
            // field1
            name={`operations.${i}.field1`}
            value={operation}
          />
          <input
            key={i}
            onChange={e => replace(i, e.target.value)}
            // field2
            name={`operations.${i}.field2`}
            value={operation}
          />
        </>
      ))}
      <button type="button" onClick={() => push('')}>
        Add operation
      </button>
    </form>
  )}
/>
```

However there was one hiccup left. I didn't have 1 type of complex
object, I had 12, with a total of 49 properties made up of 16 distinct
field types—and some of these types needed more than 1 input. Because
the fields needed by operations are defined by the Stellar protocol, I
also wanted to be able to quickly update them in the future with a high
degree of confidence. I also wanted complete clientside validation for
all values.

Given the scope and constraints, it became clear to me that the
individual forms should be generated from a schema. After some trial and
error iteration, I found a pattern that worked quite well. I broke the
problem down into 3 set of building blocks.

- A schema describing the fields of each form.
- A component for each field type.
- A validation rule for each field type.

I built the schema as an object, keyed by the operation name. Each
operation has a display name, an `id` (identical to the object key), and
a `fields` object. Each field is defined as an object with 5 properties:
an input name, a function to render the input, a label, a placeholder,
and a validation function (from Yup). Some fields also have a list of
options.

```js
const OperationsSchema = {
  createAccount: {
    id: 'createAccount',
    label: 'Create Account',
    fields: {
      destination: {
        name: 'destination',
        render: props => <Address {...props} />,
        label: 'Destination',
        placeholder: '',
        validation: stellarAddress().required(),
      },
      startingBalance: {
        name: 'startingBalance',
        render: props => <Amount {...props} />,
        label: 'Starting balance',
        placeholder: '',
        validation: amount().required(),
      },
      source: {
        name: 'source',
        render: props => <Address {...props} />,
        label: 'Source account',
        placeholder: '',
        validation: stellarAddress(),
      },
    },
  },
  // ...
};
```

I found this dramatically reduced the amount of code I had to write. By
generating each operation's form from this schema, I only had to write
validation rules and a component for each field type. This isn't to say
that it was a trivial amount of code! The operation schema, form inputs,
and validation rules total just over 1000 lines. These building blocks,
however, leave few cracks for bugs to hide in, and significantly reduced
the amount of testing I felt necessary.

Most field types are trivial, simple compositions of Formik helpers;
only separated for easy of future exension or styling. The complex field
types got unit tests to ensure their behavior. The rendering logic
(below) is trivial, simply mapping over the `selectedOperation.fields`
and calling `render()`. The validation rules are easy to unit test, and
follow Yup's conventions.

```js
<form onSubmit={handleSubmit}>
  <input type="hidden" name="name" value={operationType} />
  {fields.map(({ render, name, options, label, placeholder }) =>
    render({
      key: name,
      name,
      label,
      placeholder,
      options,
    }),
  )}
  <button type="submit">Save operation</button>
</form>
```

I'm so confident in the way these blocks fit together, I didn't feel a
need to write integration tests for the final forms—it would amount to
verifying that the schema objects have the right properties and that
there are no typos.

The application itself is still an alpha and hasn't been open sourced
yet, so I don't want to share a link before it's ready for prime time.
But I've included a short demonstration of the completed form below.
It's rough! It hasn't passed by a designer yet! But I find it easy to
use and clear (if hideous and a little jarring at times).

<iframe src='https://gfycat.com/ifr/InnocentHoarseDesertpupfish' frameborder='0' scrolling='no' width='100%' height='585px'></iframe>

That's it! I wish you luck on the complex forms you make in the future.
