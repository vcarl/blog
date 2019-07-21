---
title: Role based authorization in React
description:
  Restricting parts of your app to different types of users can be
  difficult. Here's how you can do it maintainably and extensibly.
tags: react, patterns
date: 2017-01-20
---

Authentication and authorization are both common problems when writing
an application. Authentication answers the question “who are you?” while
authorization answers the question “are you allowed to see that?”

Somebody recently asked how to accomplish role-based authorization using
React and react-router, and
[linked to a post](http://frontendinsights.com/role-based-authorization-using-react-router/)
describing one way to go about it. Essentially, the post suggests simply
passing a list of roles that are allowed to see a given route, and
checking whether the currently logged in user is one of those roles
within your route handler.

That would work, but I see a few problems with it.

- Single responsibility principle violations
- Unnecessarily passing data through react-router
- No reusable code

So how can we do authorization in a way that gives each component a
single job to do, is self contained, and is reusable?

---

One way we could improve upon the above blog’s code would be to
encapsulate the authorization logic in its own component and render that
from your route handler.

```js
// Route handler
class YourRoute extends React.Component {
  componentDidMount() {
    // Load user from wherever into state.
  }

  render() {
    return (
      <Authorization
        allowed={this.props.allowed}
        user={this.state.user}
      >
        /* the rest of your page */
      </Authorization>
    );
  }
}

export default YourRoute;

// Router configuration
() => (
  <Router history={BrowserHistory}>
    <Route path="/" component={App}>
      <Route
        allowed={['manager', 'admin']}
        path="feature"
        component={YourRoute}
      />
    </Route>
  </Router>
);
```

This gives us reusable authorization logic, which is a step in the right
direction. We could even have the `Authorization` component load the
user itself, so all it took as props are the allowed roles. But each
route would still “own” the fact that authorization is taking place,
which doesn’t feel right.

But there’s another option. A
[higher order component](https://facebook.github.io/react/docs/higher-order-components.html),
often abbreviated as HOC, could move the authorization logic completely
outside of the route handler. Assuming the Authorization HOC loads the
currently logged-in user on its own, it could look like the following:

```js
// Authorization HOC
const Authorization = (WrappedComponent, allowedRoles) =>
  class WithAuthorization extends React.Component {
    // In this case the user is hardcoded, but it could be loaded
    // from anywhere. Redux, MobX, RxJS, Backbone...
    state = {
      user: {
        name: 'vcarl',
        role: 'admin',
      },
    };

    render() {
      const { role } = this.state.user;

      if (allowedRoles.includes(role)) {
        return <WrappedComponent {...this.props} />;
      }
      return <h1>No page for you!</h1>;
    }
  };

// Route handler
class YourRoute extends React.Component {
  render() {
    return <div>/* the rest of your page */</div>;
  }
}

export default Authorization(YourRoute, ['manager', 'admin']);

// Router configuration
() => (
  <Router history={BrowserHistory}>
    <Route path="/" component={App}>
      <Route path="feature" component={YourRoute} />
    </Route>
  </Router>
);
```

I almost didn’t include an implementation of the Authorization HOC,
because it depends on what you’re using to store your data, whether you
want to show an error message or redirect somewhere else on failure,
which router you’re using, etc. There are a lot of unknowns, and I want
to focus on the pattern rather than the implementation details. The
important thing is that it inspects the currently logged in user and
renders the wrapped component they have a sufficient role.

Because it doesn’t matter when the HOC is applied, we could move that
function call into the router configuration.

```diff
// Route handler
 class YourRoute extends React.Component {
   render() {
     return <div>
       /* the rest of your page */
     </div>
   }
 }

- export default Authorization(YourRoute, ['manager', 'admin'])
+ export default YourRoute

 // Router configuration
+ const RouteWithAuthorization = Authorization(YourRoute, [
+  "manager",
+  "admin"
+]);

 () =>
   <Router history={BrowserHistory}>
     <Route path="/" component={App}>
       <Route
         path="feature"
-        component={YourRoute}
+        component={RouteWithAuthorization}
       />
     </Route>
   </Router>
```

Wrapping a component in a HOC within `render` can cause a lot of
problems, and as a rule, shouldn’t be done. Always create wrapped
components outside the render method.

```js
const RouteWithAuthorization = Authorization(YourRoute, ['roles']);
```

For further reading on why this is a bad idea, check
[the React documentation](https://reactjs.org/docs/higher-order-components.html#dont-use-hocs-inside-the-render-method).

Great! Now there’s isn’t a hint of authorization logic in our route
handler, nothing is being passed through react-router, and all of our
allowed roles are defined in a single file. But you know what, if we
have a lot of routes, that’s going to mean a lot of duplicated role
definitions.

Let’s make two changes: Flip the order of the arguments we give to the
HOC, and
“[curry](https://drboolean.gitbooks.io/mostly-adequate-guide/content/ch4.html)”
the function. Our HOC becomes a function that returns a HOC. This type
of function call should look familiar if you use Redux, as it’s the same
mechanism `connect` uses.

```diff
// Authorization HOC
- const Authorization = (WrappedComponent, allowedRoles) =>
+ const Authorization = (allowedRoles) =>
+  (WrappedComponent) =>
     return class WithAuthorization extends React.Component {
       constructor(props) {
         super(props)
// ...


// Router configuration
() =>
  <Router history={BrowserHistory}>
    <Route path="/" component={App}>
      <Route
        path="feature"
-       component={Authorization(YourRoute, ['manager', 'admin'])}
+       component={Authorization(['manager', 'admin'])(YourRoute)}
      />
    </Route>
  </Router>
```

Now, we can “seed” our authorization HOC with different levels of
allowed roles, eliminating the need to define allowed roles over and
over.

```diff
// Router configuration
+ const Manager = Authorization(['manager', 'admin'])

<Router history={BrowserHistory}>
  <Route path="/" component={App}>
    <Route
      path="feature"
-     component={Authorization(['manager', 'admin'])(YourRoute)}
+     component={Manager(YourRoute)}
    />
  </Route>
</Router>
```

There, that’s better. Now we can define a set number of roles in
advance, and we could have a router configuration like this:

```js
// Router configuration
// react-router v3's static config
const User = Authorization(['user', 'manager', 'admin']);
const Manager = Authorization(['manager', 'admin']);
const Admin = Authorization(['admin']);

const UserList = User(Users);
const RestrictedEditUser = Manager(EditUser);
const RestrictedCreateUser = Admin(CreateUser);

() => (
  <Router history={BrowserHistory}>
    <Route path="/" component={App}>
      <Route path="users" component={UserList}>
        <Route path=":id/edit" component={RestrictedEditUser} />
        <Route path="create" component={RestrictedCreateUser} />
      </Route>
    </Route>
  </Router>
);
```

Users are able to see everyone, managers can edit users, and admins can
add new users. It’s clearly apparent what the intent is by looking at
the usage, and each part of the code has a single responsibility.

Of course, client-side authorization is only one part of it. The backend
should always enforce user roles as well, because all data on the client
can be changed from the devtools.

Do you disagree, or think you have a way to improve this? Let me know!
I’m vcarl in Reactiflux. This is not a best practice, this is an idea
that I thought would solve problems people are facing in the real world.
I published this as a blog post instead of a library because everyone’s
use case is different. Maybe in your app, the Authorization HOC passes
the current role as a prop into the component it’s wrapping. Maybe one
of the curried arguments is a component to render if authorization
fails. Maybe instead of a higher order component, it’s a component with
a function child that gets the role and whether authorization succeeded
as arguments. Maybe instead of an array of allowed roles, you pass a
function with the signature `user => bool`.

---

As a P.S., React has a number of idioms that let you write really
expressive, concise code once you’re familiar with them. Higher order
components, function children, and (basic) currying are concepts with
very simple code: each of them takes only a few lines, but once you
figure out of what types of problems they solve, you can combine them in
ways that make them extremely powerful.

I’m also on Twitter where I mostly tweet tech stuff, and Reactiflux,
where I help answer React questions.
