import { compiler } from './compiler.js'
import { contentUpdate, attributeHandler } from './updates-and-handler/distribution.js'
import { show, query, loop } from './dynamic-tag-operations/distribution.js'
import { createKey } from './create.key.js'
import { systemTools } from './tools.js'

export class Vanille {
    constructor ({ state = {}, changes = {} } = {}, template = document.body, dataID = createKey()) {
        this.template = template
        this.dataID = dataID
        this.state = state
        this.changes = changes
        
        systemTools.map(tool => this[tool.name] = (ID, param1, param2) => tool(this.template, ID, param1, param2))

        document.body.innerHTML = ''
        const templateNode = document.querySelector('template')
        const content = templateNode.content.cloneNode(true)

        this.template.appendChild(content)

        this.template.querySelectorAll('*').forEach(element => element.setAttribute(this.dataID, ''))

        this.$update()
        this.compile()

        contentUpdate(this.template, this.state, this.changes, this.dataID, true)
    }

    $use (name, useItem) {
        if (window.vanille === undefined) {
            window.vanille = {}
        }

        window.vanille[name] = useItem
        this[name] = useItem
    }

    $update (doItByForce) {
        loop(this.template, this.state, this.changes, this.dataID)
        contentUpdate(this.template, this.state, this.changes, this.dataID, doItByForce)
        attributeHandler(this.template, this.state, this.changes, this.dataID)
        show(this.template, this.state, this.dataID)
        query(this.template, this.state, this.dataID)
    }
    
    compile (isUpdate) {
        compiler(this.template, this.state, this.changes, this.dataID)

        if (isUpdate) {
            this.$update()
        }
    }

    $setState (setValue) {
        setValue = (typeof setValue === 'function' ? setValue() : setValue)
        const info = {}

        for (const variableName in setValue) {
            const oldValue = JSON.stringify(this.state[variableName])
            const incomingValue = {
                name: variableName,
                value: setValue[variableName]
            }
            this.state[variableName] = setValue[variableName]

            info[`update variable name: "${variableName}"`] = {
                incomingValue,
                oldValue: JSON.parse(oldValue),
                newValue: setValue[variableName],
                type: Array.isArray(setValue[variableName]) ? 'array' : false || typeof setValue[variableName]
            }
        }

        this.$update()

        return info
    }
}