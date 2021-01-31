import { compiler } from "./system-functions/compiler.js"
import { contentUpdate, attributeHandler } from "./updates-and-handler/distribution.js"
import { show, query } from "./dynamic-tag-operations/distribution.js"
import { createKey } from "./system-functions/create.key.js"
import { systemTools } from "./tools.js"
import { setVerb } from "./system-functions/DOMVerbObject.js"
import { control } from "./system-functions/error.js"
import { Component } from "./system-functions/component.js"
import Settings from "../settings.js"

export class Verb {
    constructor({ state = {}, changes = {} } = {}, template = document.body, dataID = createKey()) {
        this.template = template
        this.dataID = dataID
        this.state = state
        this.changes = changes

        this.changeSorter(this.state)

        systemTools.map(tool => this[tool.name] = (ID, param1, param2) => tool(this.template, ID, param1, param2))

        const templateNode = document.querySelector("template"),
        content = templateNode.content.cloneNode(true)

        document.body.innerHTML = ""
        this.template.appendChild(content)

        this.compile()

        this.template.querySelectorAll("*").forEach(element => {
            element.setAttribute(this.dataID, "")

            if (element.tagName === "V") {
                setVerb(element, "true-value", element.getAttribute("true-value"))
                setVerb(element, "dependency", element.getAttribute("dependency").trim())

                element.removeAttribute("true-value")
                element.removeAttribute("dependency")
            }
        })

        this.$update("*", true)
        window.verb = {}
    }

    changeSorter(state) {
        for (const [name, value] of Object.entries(this.changes)) {
            if (name.includes("+")) {
                const cahngeNames = name.split("+")

                cahngeNames.map(changeName => {
                    changeName = changeName.trim()
                    this.changes[changeName] = () => value(eval(changeName))
                })

                delete this.changes[name]
            }
        }
    }

    $use(name, useItem) {
        if (window.verb === undefined) {
            window.verb = {}
        }

        window.verb[name] = useItem
        this[name] = useItem
    }

    $getVerb(id) {
        control(typeof id === "string").err("When you want to pull the verb object of an element, you must send a string value as id to getVerb method.")

        return this.template.querySelector(id).verb
    }

    $update(updateName, doItByForce) {
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

    compile() {
        compiler(this.template, this.state, this.changes, this.dataID)
    }

    $createComponent({ rootName, component, props = {} }) {
        control(document.querySelector(rootName) !== null).err(`A component tag with root name "${rootName}" was not found. Make sure there is an HTML tag with the same name as the rootName you sent`)
        const components = []

        document.querySelectorAll(rootName).forEach(root => {
            const { componentPropsBreakPoint } = Settings,
                addAttributes = {}
            let propsClone = JSON.parse(JSON.stringify(props))

            root.getAttributeNames().map(attrName => {
                if (attrName.includes(componentPropsBreakPoint)) {
                    const propName = attrName.replace(componentPropsBreakPoint, "")
                    let propValue = root.getAttribute(attrName)

                    propValue = eval(`[${propValue}][0]`)

                    propsClone[propName] = propValue
                } else {
                    const attrValue = root.getAttribute(attrName)

                    if (!attrName.includes("data-l-")) {
                        addAttributes[attrName] = attrValue
                    }
                }
            })

            const componentClone = new Component(component).$render(root.tagName, propsClone, addAttributes)

            components.push(componentClone)
        })

        return components
    }

    $setState(setValue, doItByForce) {
        const info = {}
        setValue = (typeof setValue === "function" ? setValue() : setValue)

        for (const variableName in setValue) {
            const oldValue = JSON.stringify(this.state[variableName]),
                incomingValue = {
                    name: variableName,
                    value: setValue[variableName]
                }

            this.state[variableName] = setValue[variableName]

            info[`update variable name: "${variableName}"`] = {
                incomingValue,
                oldValue: JSON.parse(oldValue),
                newValue: setValue[variableName],
                type: Array.isArray(setValue[variableName]) ? "array" : false || typeof setValue[variableName]
            }
        }

        this.$update(doItByForce)

        return info
    }
}
