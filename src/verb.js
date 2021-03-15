import { compiler } from "./system/compiler.js"
import { contentUpdate, attributeHandler } from "./updates-and-handler/distribution.js"
import { show, query, node } from "./dynamic-tag-operations/distribution.js"
import { createKey } from "./system/create.key.js"
import { systemTools } from "./tools.js"
import { setVerb } from "./system/DOMVerbObject.js"
import { panic } from "./system/error.js"
import { Component } from "./system/component.js"
import { comradeHandler } from "./particles/comrade.js"
import Settings from "../settings.js"

export class Verb {
    constructor({ state = {}, changes = {}, created = () => { }, components } = {}, template = "body", dataID = createKey()) {
        this.template = document.querySelector(template)
        this.dataID = dataID
        this.changes = changes
        this.comrades = {}
        this.components = components
        this.created = created
        this.map = new WeakMap()
        this.verbElementList = []
        this.verbQueryList = []
        this.verbNodeList = []
        this.verbAttributeList = []
        this.verbShowList = []

        if (typeof state === "function") {
            state().then(res => {
                this.state = res
                this.cloneState = { ...this.state }
                this.first()
                this.created()
            })

            return
        }

        this.state = state
        this.cloneState = { ...this.state }
        this.first()
        this.created()
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
            this.$createComponent(name, component)
        }
    }

    first() {
        this.changeSorter()
        this.stateHandler(this.state)

        systemTools.map(tool => this[tool.name] = (ID, param1, param2) => tool(this.template, ID, param1, param2))

        const templateNode = this.template.querySelector("template")
        let content

        if (templateNode !== null) {
            content = templateNode.content.cloneNode(true)
        } else console.error("No 'template' tag found in the tag you sent")

        this.template.innerHTML = ""
        this.template.appendChild(content)

        this.compile()
        this.componentHandler()

        this.template.querySelectorAll("*").forEach(element => {
            element.setAttribute(this.dataID, "")

            if (element.tagName === "V") {
                setVerb(element, "dependency", element.getAttribute("dependency").trim())

                element.removeAttribute("dependency")
            }
        })

        window.verb = {}

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

        this.$update("*")
    }

    changeSorter() {
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

    /**
     * 
     * @param {String} name variable name to be assigned companion
     * @param {Function} comradeItem comrade
     */
    $addComrade(name, comradeItem) {
        panic(typeof name === "string" || typeof comradeItem === "function").err("The comrade name sent to the add comrade method is in string type and companion should be function")

        this.comrades[name] = (value, old) => comradeItem(value, old)
    }

    $getVerb(id) {
        panic(typeof id === "string").err("When you want to pull the verb object of an element, you must send a string value as id to getVerb method.")

        return this.template.querySelector(id).verb
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

    compile() {
        compiler(this.template, this.state, this.changes, this.dataID)
    }

    $createComponent(rootName, component, props = {}) {
        panic(this.template.querySelector(rootName) !== null).err(`A component tag with root name "${rootName}" was not found. Make sure there is an HTML tag with the same name as the rootName you sent`)

        this.template.querySelectorAll(rootName).forEach(root => {
            const { componentPropsBreakPoint } = Settings,
                addAttributes = {}
            let propsClone = { ...props }

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

            new Component(component).$render(root.tagName, propsClone, addAttributes)
        })
    }

    $setState(setValue) {
        setValue = (typeof setValue === "function" ? setValue() : setValue)

        for (const variableName in setValue) {
            this.state[variableName] = setValue[variableName]
            this.$update("*")
        }
    }
}
