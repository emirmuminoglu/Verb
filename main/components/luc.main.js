import { compiler } from './html.compiler.js'
import { contentUpdate, attributeHandler } from './updates-and-handler/distribution.js'
import { view, query } from './dynamic-tag-operations/distribution.js'
import tools from './tools.js'

export class Luc {
    constructor (dataID, { state = {}, changes = {} }) {
        this.dataID = dataID
        this.tempalte = document.body
        this.state = state
        this.changes = changes

        this.first()
    }

    first () {
        tools.map(tool => this[tool.name] = (ID) => tool(this.tempalte, ID))

        this.$compileAgain()
        this.$update()
    }

    $update (doItByForce) {
        contentUpdate(this.tempalte, this.state, this.changes, this.dataID, doItByForce)
        attributeHandler(this.tempalte, this.state, this.changes)
        view(this.tempalte, this.state)
        query(this.tempalte, this.state)
    }

    $compileAgain () {
        compiler(this.tempalte, this.state, this.changes, this.dataID)

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