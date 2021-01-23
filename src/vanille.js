import { compiler } from "./system-functions/compiler.js"
import { contentUpdate, attributeHandler } from "./updates-and-handler/distribution.js"
import { show, query } from "./dynamic-tag-operations/distribution.js"
import { createKey } from "./system-functions/create.key.js"
import { systemTools } from "./tools.js"
import { setVanille } from "./system-functions/DOMVanilleObject.js"

export class Vanille {
    constructor ({ state = {}, changes = {} } = {}, template = document.body, dataID = createKey()) {
        this.template = template
        this.dataID = dataID
        this.state = state
        this.changes = changes
        
        systemTools.map(tool => this[tool.name] = (ID, param1, param2) => tool(this.template, ID, param1, param2))

        document.body.innerHTML = ""
        const templateNode = document.querySelector("template"),
        content = templateNode.content.cloneNode(true)

        this.template.appendChild(content)

        this.compile()
        
        this.template.querySelectorAll("*").forEach(element => {
            element.setAttribute(this.dataID, "")

            if (element.tagName === "V") {
                setVanille(element, "true-value", element.getAttribute("true-value"))
                setVanille(element, "dependency", element.getAttribute("dependency"))
                
                element.removeAttribute("true-value")
                element.removeAttribute("dependency")
            }
        })

        this.$update()
    }

    $use (name, useItem) {
        if (window.vanille === undefined) {
            window.vanille = {}
        }

        window.vanille[name] = useItem
        this[name] = useItem
    }

    $update (doItByForce) {
        contentUpdate(this.template, this.state, this.changes, this.dataID, doItByForce)
        attributeHandler(this.template, this.state, this.changes, this.dataID)
        show(this.template, this.state, this.dataID)
        query(this.template, this.state, this.dataID)
    }
    
    compile () {
        compiler(this.template, this.state, this.changes, this.dataID)
    }

    $setState (setValue) {
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

        this.$update()

        return info
    }
}