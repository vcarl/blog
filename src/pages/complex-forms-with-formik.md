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

I used Formik and Yup for a particularly complex form. It needed 1 form
to input some metadata about a transaction, and a sub-form of one of 12
different varieties—called an "operation" here. The backend for this
system accepts up to 200 operations per transaction, so this form needed
to reflect that.

Some additional constraints I was working under: over the next several
years, it's likely that the validation rules will need to be adjusted an
updated, so another design goal was ease of maintenance in that regard.

# Creating a sub-form

The fundamental problem with a sub-form is that HTML doesn't allow
`<form>` to appear within another `<form>` node. I wanted my transaction
form to contain the operation forms before the 'Submit transaction'
button.

Formik provides a `submitForm` function
[as part of the "Formik bag"](https://jaredpalmer.com/formik/docs/api/formik#formik-render-methods-and-props),
which let's us imperatively trigger a form submission from outside the
form. By changing from a true submit button to a regular button that
submits on click, I can get the behavior I want.

```js
() => (
  <Formik
    // initialValues etc
    render={({ submitForm, ...props }) => (
      <>
        <TransactionForm {...props} />
        <OperationForm {...props} />
        <button onClick={submitForm}>Submit</button>
      </>
    )}
  />
);
```

I modelled this with Yup with `OperationForm` as an object array.
Because I wanted to make it easy to change the operation forms, I built
these as an object.

```js
const formSchema = {
  input: {
    id: 'input',
    label: 'string',
    fields: [
      {
        name: 'string',
        render: props => <Input {...props} />,
        placeholder: 'string',
        default: 'input value',
        validation: yup.string('Any yup rule'),
      },
    ],
  },
  // …
};
```

I found this let me build up a catalog of useful input components and
validation rules, letting me express the full range of form values. By
building custom yup validators for data structures specific to this
service, I'm confident I'll be able to keep this up-to-date with minimal
effort as changes occur.

There are 2 parts to rendering this: gathering up validation rules, and
rendering the inputs. I wrote a helper function to extract the input
name and validation rule to build a yup schema, putting it on a `ref` in
my form component. With my `render` function, I can return
`fields.map(({render}) => render())`

# Lists of inputs

The signatures for the transaction are simple strings, but there can be
up to 20 of them. Dealing with lists in forms introduces a lot more
complexity. Tracking which index to update, adding new elements, and
removing existing elements all add logic.

Formik, luckily, provides a utility specifically to help in this case;
`FieldArray`. It provides
[a number of typical array methods](https://jaredpalmer.com/formik/docs/api/fieldarray#fieldarray-helpers),
which went a long way in helping with this situation that I had
previously found so frustrating.

I found I could get away with only using `push` and `remove`. Formik
understands dot notation in input names, so it can automatically wire up
`Field`s if you provide the name.

```js
<FieldArray
  name="someArrayField"
  render={({ push, remove }) => (
    <>
      {values.someArrayField.map((signer, i) => (
        <>
          <input key={i} name={`someArrayField.${i}`} />
          <button type="button" onClick={() => remove(i)}>
            Remove
          </button>
        </>
      ))}
      <button type="button" onClick={() => push('')}>
        Add new
      </button>
    </>
  )}
/>
```

The only struggle I had here, really, was how to present the add and
remove interactions to the user. Formik made it so easy for me to
implement the basic functionality that I had some extra time and
motivation to play with different experiences.

# Lists of many different complex inputs

Formik provides such fantastic handling of input names when determining
changes, I found no additional complexity when the lists were made of
complex objects, as in the case of the operations sub-forms. In the real
app, each of these form bodies were constructed from the object
described above.

```js
<FieldArray
  name="operations"
  render={({ push, remove, replace }) => (
    <form>
      {values.operations.map((operation, i) => (
        <>
          <input key={i} name={`operations.${i}.field1`} />
          <input key={i} name={`operations.${i}.field2`} />
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
