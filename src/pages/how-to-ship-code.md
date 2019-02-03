---
title: How to ship code
published: true
description: How to ship code that you'll be happy to maintain.
tags: programming, software engineering
cover_image: https://thepracticaldev.s3.amazonaws.com/i/k61usly9cf4gdqykoai2.jpg
date: 2018-08-20
---

(Cover photo by
[Tobias A. Müller](https://unsplash.com/photos/fusq9KwkSF4))

There are a ton of "best practices" preached when talking about
authoring software. Ways to improve performance, readability,
maintainability, flexibility. Much of the advice is more dogmatic than
pragmatic, though. When you're actually shipping features, what you
really need is code that isn't a mass of spaghetti and performs well
enough to be useful. Adhering to all the best practices won't always
improve the quality of the end product.

So how can we balance best practices and shipping code? I'd like to
offer some pragmatic advice on how to ship features that you won't hate
to maintain in 6 months.

## Don't start with code.

Think about the problem at hand for a minute. Define what the outcome
you're trying to achieve is, and how the code you're going to write will
accomplish that. This could be a written specification, a wireframe, a
swagger definition, a mind mapping diagram, a pro and cons list (or even
several of these!). If you don't have a preferred way of thinking about
code, try out different strategies until you find what helps you. At
work, my team lead wrote a spec template with 5 or 6 questions on it.
I'm a frontend developer using React, so the questions are geared for
that area of development. It's very helpful for getting the words
flowing, though often most of the questions don't end up being directly
answered.

- What state will the feature have?
- How does the user interact with it?
- What tools will help you build it?
  - Tools that are already used in the project.
  - New dependencies.
  - New library code you'll write.

Thinking through and documenting what your end goal is will help you
stay focused on the result. It's easy to get off in the weeds of
refactoring and optimizing existing code. If you come up for air and
refocus on your original goal, you may realize that what you've focused
on doesn't get you closer to shipping. Spotting when you've begun
working on a tangent can help you isolate the new problem and work on it
later.

## Prototype quickly

It's very unlikely that the code you start writing will survive
unchanged, so it doesn't need to be perfect. It doesn't even need to be
good! When you begin, you're discovering edge cases you couldn't spot
while thinking abstractly about the feature. The assumptions you made
about the technology you're building will be challenged. The faster you
can figure out what the limitations are and what faulty assumptions you
held, the faster you'll ship something you're happy with.

As you get deeper into the implementation, you can begin cleaning up and
refactoring the hacky garbage you generated at first. Once you've built
out more of the feature, you'll have a better understanding of what your
needs are. The best part about deliberately writing sloppy code is that
you can feel good about throwing it out. Because you focused on writing
it fast, you minimize lost time from rewriting it.

## Don't stress the tests

This is probably controversial, but I am not rigorous about test-driven
development (TDD) in all cases. I'm usually not sure exactly what I'm
building to start with, let alone understand it well enough to write
tests. I find that writing tests prematurely either makes me feel
locked-in to my first idea or forces me to burn a lot of time rewriting
tests. Once I've written some garbage and cleaned it up into the rough
shape of the final product, I'll start thinking of tests. At that point,
I'll do some TDD in the form of finalizing the API I want to thinking
about edge cases.

That's not to say I _never_ do TDD. While prototyping I find sometimes
that I need to do a somewhat complex calculation. If I am confident that
I understand what inputs and outputs I'll need, I'll write some tests
first. This is the ideal case for TDD in my experience, and I will
happily write tests before implementing when it makes sense.

Tests should be informative, and good tests _save you time_. If you're
frequently changing them—or avoiding changes because you know it will
require changing tests—they may be better off deleted. I only add tests
for UI once I'm confident that it's in a stable state.

## Polish code as it stabilizes

Once your pile of trash has begun to have some good structure and
clearly defined responsibilities, start polishing those parts. I would
call polishing code any changes that don't directly affect its
_correctness_. You might add some inline comments to clarify why the
code is written the way it is. Revise variable names to clarify their
purpose. Add some documentation about how to use it. Profile performance
and optimize hot code paths. If you're writing a UI component, you might
add more subtle visual effects and animations.

Waiting until your code has stabilized before polishing helps balance
creating new features, keeping performance adequate, and paying down
technical debt. I personally find it's also very helpful to revisit code
periodically in the weeks after I've written it. It's a short enough
amount of time that I still remember the bulk of it, but long enough
that I have to read the code to refresh my memory of how it works. Some
of my best refactors come when I'm rereading my code at this stage.

---

Thanks for reading! I'm on Twitter as
[@vcarl\_](https://twitter.com/vcarl_) (but most other places I'm
vcarl). I moderate [Reactiflux](http://join.reactiflux.com/), a chatroom
for React developers and
[Nodeiflux](https://discordapp.com/invite/vUsrbjd), a chatroom for
Node.JS developers. If you have any questions or suggestions, reach out!
