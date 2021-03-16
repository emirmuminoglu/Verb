import { compiler } from './compiler.js'
import { contentUpdate, attributeHandler, show, query, node } from './DOM.handlers/distribution.js'
import { createKey, setVerb, comradeHandler, createComponent, tools, log } from './utils/distribution.js'
import Settings from "./settings.js"

export class Component {
    /**
     *
     * @param {Object} param0 Component data submitted during component creation must be object
     */
    constructor({
        html,
        state = () => ({}),
        methods = () => ({}),
        events = () => ({}),
        changes = () => ({}),
        created = () => { },
        propTypes = {},
        components = {}
    } = {}) {
        this.template = ""
        this.html = html
        this.events = events
        this.stateConsumer = state
        this.changesConsumer = changes
        this.changes = {}
        this.state = {}
        this.props = {}
        this.components = components
        this.methods = methods
        this.created = created
        this.propTypes = propTypes
        this.cloneState = { ...this.state }
        this.comrades = {}
        this.map = new WeakMap()
        this.verbElementList = []
        this.verbQueryList = []
        this.verbNodeList = []
        this.verbAttributeList = []
        this.verbShowList = []

        const keys = [state, methods, events, changes, created].map(item => {
            if (typeof item !== 'function') {
                log.err("state, methods, changes, events and created values ​​must be methods in components.")
            }
        })
    }

    /**
     * 
     * @param {String} name variable name to be assigned companion
     * @param {Function} comradeItem comrade
     */
    $addComrade(name, comradeItem) {
        if (typeof name !== 'string' || typeof comradeItem !== 'function') {
            log.err("The comrade name sent to the add comrade method is in string type and companion should be function")

            return
        }

        this.comrades[name] = (value, old) => comradeItem(value, old)
    }

    /**
     * @param {String} path
     */

    $getTemplate = async (path) => await fetch(path).then(res => res.text())

    /**
     * @param {String} tagName is the name of the main label of this component
     * @param {Object} attributes are the characteristics of the main label of this component
     * @param {String} inner are HTML codes of the main tag of this component
     */

    $template(tagName, attributes, inner) {
        if (typeof tagName !== 'string') {
            log.err('When creating a component container with the $template method, the first parameter must contain a string value tag name, it cannot be sent empty.')

            return
        } else if (typeof attributes !== 'object') {
            log.err("Attributes to be given to the component container must be contained in an object. Object names and values ​​are equal to attribute names and values")

            return
        } else if (inner !== undefined && typeof inner !== 'string') {
            log.err("A string value must be sent as the last parameter to the $template method in the component. The last parameter is taken as HTML content")

            return
        }

        const template = document.createElement(tagName)

        for (const name in attributes) {
            template.setAttribute(name, attributes[name])
        }

        template.innerHTML = inner

        return template
    }

    stateHandler(obj) {
        const map = this.map,
            _this = this

        for (const key in obj) {
            if (typeof obj[key] === 'object') {
                this.stateHandler(obj[key])
            } else {
                this.map.set(obj, { ...obj })

                Object.defineProperty(obj, key, {
                    get() {
                        return map.get(obj)[key]
                    },
                    set(value) {
                        map.get(obj)[key] = value
                        _this.$update()
                    }
                })
            }
        }
    }

    componentHandler() {
        for (const [name, component] of Object.entries(this.components)) {
            createComponent(this.template, name, component)
        }
    }

    first(dataID) {
        this.template.setAttribute(dataID, "")
        this.stateHandler(this.state)
        this.compile()
        this.componentHandler()

        tools.map(tool => this[tool.name] = (ID) => tool(this.template, ID))

        this.eventHandler()

        this.template.querySelectorAll("*").forEach(element => {
            element.setAttribute(dataID, "")

            if (element.tagName === "V") {
                setVerb(element, "dependency", element.getAttribute("dependency"))
            }
        })

        this.template.querySelectorAll('*').forEach(e => {
            if (e.tagName === Settings.variableTagName.toUpperCase()) this.verbElementList.push(e)

            if (e.hasAttribute(Settings.dynamicTagBreakPoint + 'if')) this.verbQueryList.push(e)

            if (e.hasAttribute(Settings.dynamicTagBreakPoint + 'show')) this.verbShowList.push(e)

            const attributeNames = e.getAttributeNames()
            for (const i in attributeNames) {
                const name = attributeNames[i]

                if (name.includes(Settings.dynamicTagBreakPoint + 'node')) {
                    this.verbNodeList.push(e)

                    break
                } else if (name.includes(Settings.dynamicTagAttributeBreakPoint)) {
                    this.verbAttributeList.push(e)

                    break
                }
            }
        })

        this.$update()
    }

    $update() {
        contentUpdate(this.verbElementList, this.state, this.changes, this.dataID)
        attributeHandler(this.verbAttributeList, this.state, this.changes, this.dataID)
        show(this.verbShowList, this.state, this.dataID)
        query(this.verbQueryList, this.state, this.dataID)
        node(this.verbNodeList, this, this.dataID)

        comradeHandler(this.comrades, this.cloneState, this.state)
        this.cloneState = { ...this.state }
    }

    /**
     * @param {Boolean} isUpdate Will it be updated after compilation?
     * @param {Boolean} doItByForce Update after compilation will make mandatory update true: forced update, controlled update
     */

    compile() {
        compiler(this.template, this.state, this.changes, this.dataID)
    }

    eventHandler() {
        for (const name in this.eventsConsumer) {
            const eventName = name.slice((name.indexOf("[") + 1), name.indexOf("]")).trim(),
                event = this.eventsConsumer[name],
                id = name.slice(0, name.indexOf("[")).trim(),
                additionalProcessingMode = name.includes('$$')

            if (name === "top") {
                const top = this.eventsConsumer.top,
                    id = this.eventsConsumer.top.id,
                    topAdditionalProcessingMode = this.eventsConsumer.top.update,
                    elements = this.template.querySelectorAll(id)

                elements.forEach(el => {
                    for (let [name, event] of Object.entries(top)) {
                        el.addEventListener(name, e => {
                            event(e)

                            if (topAdditionalProcessingMode) this.$update()
                        })
                    }
                })
            } else {
                this.template.querySelectorAll(id).forEach(el => {
                    el.addEventListener(eventName, e => {
                        event(e)

                        if (additionalProcessingMode) this.$update()
                    })
                })
            }
        }
    }

    propTypesControl() {
        for (const [controlName, controlValue] of Object.entries(this.propTypes)) {
            if (typeof controlValue !== "string") {
                log.err("Control values ​​in prop type checks must be strings")

                return
            }

            const type = controlValue.replace(".require", ""),
                require = controlValue.includes(".require"),
                prop = this.state[controlName]

            if (prop !== undefined && typeof prop === type) {
                log.err(`"${controlName}" value was expected to come in "${type}" type but came in "${typeof prop}" type. Value:` + prop + ". Type: " + typeof prop)
            } else if (require) {
                log.err(`The value of "${controlName}" was supposed to come but it didn"t. Props:`, this.state)
            }
        }
    }

    /**
     * @param {any} prop
     * @param {String} dataID dataID must be a string. dataID is not required to be sent
     */

    async $render(root, prop, addAttributes, routerMode = false, dataID = createKey()) {
        this.props = prop
        this.state = Object.assign(await this.stateConsumer(), prop)
        this.template = await this.html(prop, this.state)
        this.methods = this.methods(prop, this.state)
        this.eventsConsumer = this.events(prop, this.state)
        this.changes = this.changesConsumer(prop, this.state)
        this.dataID = dataID

        const rootElement = document.querySelector(root)

        for (const [name, value] of Object.entries(addAttributes)) {
            this.template.setAttribute(name, value)
        }

        const tempaltePropChild = this.template.querySelector("prop-child"),
            propChild = rootElement.children

        if (tempaltePropChild !== null) tempaltePropChild.replaceWith(...propChild)

        this.first(dataID)

        if (routerMode) {
            rootElement.innerHTML = ""
            rootElement.appendChild(this.template)
        } else rootElement.replaceWith(this.template)

        this.propTypesControl()
        this.created(prop, this.state)
    }

    /**
     * @param {Object} setValue exchange operations must be
     * done within a JSON object. Each value in the object is
     * equal to a value in the state
    */

    $setState(setValue) {
        setValue = (typeof setValue === 'function' ? setValue() : setValue)

        for (const variableName in setValue) {
            this.state[variableName] = setValue[variableName]
            this.$update()
        }
    }
}
