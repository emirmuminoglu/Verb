# Verb.js
javascript library

### Document Site
[https://verbjs.github.io/polat-poyraz.github.io/index.html#home](https://verbjs.github.io/polat-poyraz.github.io/index.html#home)

### About
Verb.js aims to increase the dynamics of simple javascript applications in a simple and powerful way, at the same time, it significantly increases the communication between javascript and HTML.

### where is it used
It is used in applications that are very dynamic and have multiple functions with plain javascript, where javascript interferes with HTML and can have more than one scenario.

### Use
The simplest way to use Verb.js is to buy a clone on github. After getting the clone, all the features are available from the ``distribution.js`` file in the Verb folder.

```
git clone https://github.com/Verbjs/verb.git
```

If you are using verb in the main html file, you must function in template tags. The main verb is in a class structure, the state in which you can operate on HTML contains variables

```html
<template>
  <h1> {{ state.message }} </h1>
</template>

<script type="module">
  import { Verb } from "./verb/distribution.js"

  const app = new Verb({
    state: {
      message: "Hello World"
    }
  })
</script>
```

### update
When a change is made, a variable on state is automatically reflected on the HTML, but you should notify verb.js of this change. For this notification process, you must run the ``$update`` process.

```html
<template>
  <h1> {{ state.message }} </h1>
</template>

<script type="module">
  import { Verb } from "./verb/distribution.js"

  const app = new Verb({
    state: {
      message: "Hello World"
    }
  })

  setTimeout(() => {
    app.state.message = "Hello Verb.js"
  }, 2000)
</script>
```

All features and detailed description of verb.js are available on the [document](https://verbjs.github.io/polat-poyraz.github.io/index.html#home) site.