import { compiler } from './html.compiler.js'
import { contentUpdate, attributeHandler } from './updates-and-handler/distribution.js'
import { view, query, loop } from './dynamic-tag-operations/distribution.js'
import Tools from './tools.js'

export class Luc {
    constructor (template, dataID, { state = {}, changes = {} }) {
        this.dataID = dataID
        this.template = template
        this.state = state
        this.changes = changes

        this.first()
    }

    first () {
        Tools.map(tool => this[tool.name] = (ID, param1, param2) => tool(this.template, ID, param1, param2))

        this.template.querySelectorAll('*').forEach(element => {
            element.setAttribute(this.dataID, '')
        })

        this.$update()
        this.$compileAgain()
    }

    $update (doItByForce) {
        loop(this.template, this.state, this.changes, this.dataID)
        contentUpdate(this.template, this.state, this.changes, this.dataID, doItByForce)
        attributeHandler(this.template, this.state, this.changes, this.dataID)
        view(this.template, this.state, this.dataID)
        query(this.template, this.state)
    }
    
    $compileAgain () {
        compiler(this.template, this.state, this.changes, this.dataID)

        return {$update: (doItByForce) => this.$update(doItByForce)}
    }

    $setState (setValue) {
        setValue = (typeof setValue === 'function' ? setValue() : setValue)
        const variables = {}

        for (const variableName in setValue) {
            this.state[variableName] = setValue[variableName]
            variables[variableName] = setValue[variableName]
        }

        this.$update()

        return variables
    }
}