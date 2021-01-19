import { compiler } from './compiler.js'
import { contentUpdate, attributeHandler } from './updates-and-handler/distribution.js'
import { show, query, loop } from './dynamic-tag-operations/distribution.js'
import { createKey } from './create.key.js'
import { systemTools } from './tools.js'

export class Luc {
    constructor ({ state = {}, changes = {} } = {}, template = document.body, dataID = createKey()) {
        this.template = template
        this.dataID = dataID
        this.state = state
        this.changes = changes
        
        systemTools.map(tool => this[tool.name] = (ID, param1, param2) => tool(this.template, ID, param1, param2))

        this.template.querySelectorAll('*').forEach(element => element.setAttribute(this.dataID, ''))

        this.$update()
        this.$compileAgain()
    }

    $use (name, useItem) {
        if (window.luc === undefined) {
            window.luc = {}
        }

        window.luc[name] = useItem
    }

    $update (doItByForce) {
        loop(this.template, this.state, this.changes, this.dataID)
        contentUpdate(this.template, this.state, this.changes, this.dataID, doItByForce)
        attributeHandler(this.template, this.state, this.changes, this.dataID)
        show(this.template, this.state, this.dataID)
        query(this.template, this.state, this.dataID)
    }
    
    async $compileAgain (isUpdate) {
        await compiler(this.template, this.state, this.changes, this.dataID)

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