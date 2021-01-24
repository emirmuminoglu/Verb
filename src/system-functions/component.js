import { compiler } from "./compiler.js"
import { contentUpdate, attributeHandler } from "../updates-and-handler/distribution.js"
import { show, query } from "../dynamic-tag-operations/distribution.js"
import { createKey } from "./create.key.js"
import { systemTools } from "../tools.js"
import { setVanille } from "./DOMVanilleObject.js"
import { control } from "./error.js"

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
        propTypes = {}
    } = {}) {
        this.template = ""
        this.html = html
        this.events = events
        this.stateConsumer = state
        this.changesConsumer = changes
        this.changes = {}
        this.state = {}
        this.props = {}
        this.methods = methods
        this.created = created
        this.propTypes = propTypes

        const keys = [state, methods, events, changes, created].map(item => {
            control(item).is({ type: "function" }).err("state, methods, changes, events and created values ​​must be methods in components.")
        })

    }

    /**
     * @param {String} tagName is the name of the main label of this component
     * @param {Object} attributes are the characteristics of the main label of this component
     * @param {String} inner are HTML codes of the main tag of this component
     */

    $template(tagName, attributes, inner) {
        control(tagName).is({ type: "string" }).err("When creating a component container with the $template method, the first parameter must contain a string value tag name, it cannot be sent empty.")

        control(attributes).is({ type: "object" }).err("Attributes to be given to the component container must be contained in an object. Object names and values ​​are equal to attribute names and values")

        control(inner).isNot({ value: undefined }).is({ type: "string" }).err("A string value must be sent as the last parameter to the $template method in the component. The last parameter is taken as HTML content")

        const template = document.createElement(tagName)

        for (const name in attributes) {
            template.setAttribute(name, attributes[name])
        }

        template.innerHTML = inner

        return template
    }

    first(prop, dataID) {
        this.template.setAttribute(dataID, "")

        systemTools.map(tool => this[tool.name] = (ID) => tool(this.template, ID))

        this.compile()

        this.eventHandler(prop)

        this.template.querySelectorAll("*").forEach(element => {
            element.setAttribute(dataID, "")
            if (element.tagName === "V") {
                setVanille(element, "true-value", element.getAttribute("true-value"))
                setVanille(element, "dependency", element.getAttribute("dependency").trim())

                element.removeAttribute("true-value")
                element.removeAttribute("dependency")
            }
        })

        this.$update("*", true)

        contentUpdate(this.template, this.state, this.changes, this.dataID, true)
    }

    /**
     * @param {Boolean} doItByForce specifies obligation to update,
     * true: force update, false: check value
     */

    $update(updateName, doItByForce = false) {
        control(doItByForce).is({ type: "boolean" }).err("The forced update parameter sent to the $update method should have been true or false")

        if (updateName === undefined || updateName === "*") {
            contentUpdate(this.template, this.state, this.changes, this.dataID, doItByForce)
            attributeHandler(this.template, this.state, this.changes, this.dataID)
            show(this.template, this.state, this.dataID)
            query(this.template, this.state, this.dataID)
        } else {
            updateName === "content" ? contentUpdate(this.template, this.state, this.changes, this.dataID, doItByForce) : null
            updateName === "attribute" ? attributeHandler(this.template, this.state, this.changes, this.dataID) : null
            updateName === "show" ? show(this.template, this.state, this.dataID) : null
            updateName === "query" ? query(this.template, this.state, this.dataID) : null
        }
    }

    /**
     * @param {Boolean} isUpdate Will it be updated after compilation?
     * @param {Boolean} doItByForce Update after compilation will make mandatory update true: forced update, controlled update
     */

    compile() {
        compiler(this.template, this.state, this.changes, this.dataID)
    }

    eventHandler(props) {
        for (const name in this.eventsConsumer) {
            const eventName = name.slice((name.indexOf("[") + 1), name.indexOf("]")).trim(),
                event = this.eventsConsumer[name],
                id = name.slice(0, name.indexOf("[")).trim(),
                additionalProcessing = name.slice((name.indexOf("(") + 1), name.indexOf(")")).trim(),
                additionalProcessingMode = name.includes("($update)")

            if (name === "top") {
                const top = this.eventsConsumer.top,
                    id = this.eventsConsumer.top.id,
                    elements = this.template.querySelectorAll(id)

                elements.forEach(el => {
                    for (let [name, event] of Object.entries(top)) {
                        const topAdditionalProcessingMode = name.includes("($update)")

                        name = name.replace("($update)", "").trim()

                        if (name !== id) {
                            el.addEventListener(name, (target) => {
                                event({ element: el, target, props: props, _this: this })

                                if (topAdditionalProcessingMode) {
                                    const additionalProcessing = name.slice((name.indexOf("(") + 1), name.indexOf(")")).trim()


                                    this[additionalProcessing]("*", true)
                                }
                            })
                        }
                    }
                })
            } else {
                this.template.querySelectorAll(id).forEach(el => {

                    el.addEventListener(eventName, (target) => {
                        event({ element: el, target, props: props })

                        if (additionalProcessingMode) {
                            this[additionalProcessing]("*", true)
                        }
                    })
                })
            }
        }
    }

    /**
     * @param {any} prop 
     * @param {String} dataID dataID must be a string. dataID is not required to be sent
     */

    async $render(root, prop, addAttributes, dataID = createKey()) {
        this.props = prop
        this.state = Object.assign(this.stateConsumer(), prop)
        this.template = await this.html(prop, this.state)
        this.methodsConsumer = this.methods(prop, this.state)
        this.eventsConsumer = this.events(prop, this.state)
        this.changes = this.changesConsumer(prop, this.state)
        this.dataID = dataID

        const rootElement = document.querySelector(root)
        
        this.first(prop, dataID)
        
        for (const [name, value] of Object.entries(addAttributes)) {
            this.template.setAttribute(name, value)
        }
        
        const tempaltePropChild = this.template.querySelector("prop-child"),
            propChild = rootElement.children[0]

        if (tempaltePropChild !== null) {
            tempaltePropChild.replaceWith(propChild)
        }

        rootElement.replaceWith(this.template)

        this.created(prop, this.state)

        return this
    }

    /**
     * @param {Object} setValue exchange operations must be
     * done within a JSON object. Each value in the object is
     * equal to a value in the state
    */

    $setState(setValue, doItByForce) {
        setValue = (typeof setValue === "function" ? setValue() : setValue)

        const variables = {}

        for (const variableName in setValue) {
            this.state[variableName] = setValue[variableName]
            variables[variableName] = setValue[variableName]
        }

        this.$update(doItByForce)

        return variables
    }
}