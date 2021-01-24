# Vanille.Js
still under development.  
The document will be published with detailed explanation after the first version.  

Vanille.js is written completely compatible with vanilla javascript applications. It runs on the browser inside your application without the need for an additional file compiler. Vanille.js does not shape your application, it is just a means of transportation.  

It's a temporary narrative until the first version comes out.

## create

```js
// javascript
import { Vanille } from "./vanille.js/distribution.js"

const app = new Vanille({
    state: {
        message: "Hello World"
    }
})
```

## Use of variables in HTML
```html
<template>
    message: {{state.message}}
</template>

<script>
    // javascript
    import { Vanille } from "./vanille.js/distribution.js"

    const app = new Vanille({
        state: {
            message: "Hello World"
        }
    })
</script>
```

## XSS

```html
<template>
    <!-- text format -->
    message: {{state.message}}

    <!-- HTML format -->
    message: {{__html__ state.message}}
</template>

<script>
    // javascript
    import { Vanille } from "./vanille.js/distribution.js"

    const app = new Vanille({
        state: {
            text: "<h1> Hello World </h1>"
        }
    })
</script>
```

## Changes

```html
<template>
    message: {{state.message.toUpperCase()}}
</template>

<script>
    // javascript
    import { Vanille } from "./vanille.js/distribution.js"

    const app = new Vanille({
        state: {
            message: "Hello World"
        },
        changes: {
            message(messageValue) {
                return messageValue + "!"
            }
        }
    })
</script>
```

## Component
```js
export default {
    html() {
        return this.$template("div", {}, `
            <h1> {{state.title}} </h1>

            <button id="down"> Click </button>
        `)
    },
    state() {
        return {
            title: "Well Come"
        }
    },
    changes() {
        title(value) {
            return value + "!"
        }
    },
    events() {
        return {
            "#down[click]": () => {
                this.state.title = "Down"

                this.$update()
            }
        }
    },
    propTypes: {
        msg: "string.require"
    }
}
```

## Component use
```html
<template>
    <example-component></example-component>

    message: {{state.message.toUpperCase()}}
</template>

<script>
    // javascript
    import { Vanille, $componentUse } from "./vanille.js/distribution.js"
    import ExampleComponent from "./components/example-component.js"

    const app = new Vanille({
        state: {
            message: "Hello World"
        },
        changes: {
            message(messageValue) {
                return messageValue + "!"
            }
        }
    })

    $componentUse({ rootName: "example-component", Component: ExampleComponent })
</script>
```

## Component Props

```html
<template>
    <example-component p:name="'Vanille'"></example-component>

    message: {{state.message.toUpperCase()}}
</template>

<script>
    // javascript
    import { Vanille, $componentUse } from "./vanille.js/distribution.js"
    import ExampleComponent from "./components/example-component.js"

    const app = new Vanille({
        state: {
            message: "Hello World"
        },
        changes: {
            message(messageValue) {
                return messageValue + "!"
            }
        }
    })

    $componentUse({ rootName: "example-component", Component: ExampleComponent: props: {msg: "Hello World"}})
</script>
```

## Props Use
```js
export default {
    html() {
        return this.$template("div", {}, `
            <h1> {{state.title}} </h1>
            <p> {{state.msg}} </p>
            <p> {{state.name}} </p>

            <button id="down"> Click </button>
        `)
    },
    state() {
        return {
            title: "Well Come"
        }
    },
    changes() {
        title(value) {
            return value + "!"
        }
    },
    events() {
        return {
            "#down[click]": () => {
                this.state.title = "Down"

                this.$update()
            }
        }
    },
    propTypes: {
        msg: "string.require"
    }
}
```

## Component Child Prop

### index.html
```html
<template>
    <example-component p:name="'Vanille.js'">
        <div>
            Hello I am Child Prop
        </div>
    </example-component>
</template>
```

### Component: example-component.js
```js
export default {
    html() {
        return this.$template("div", {}, `
            <h1> {{state.title}} </h1>
            <p> {{state.msg}} </p>
            <p> {{state.name}} </p>

            <prop-child></prop-child>

            <button id="down"> Click </button>
        `)
    },
}
```
