import { compiler } from './html.compiler.js'
import { contentUpdate, attributeHandler } from './updates-and-handler/distribution.js'

export class Luc {
    constructor (dataID, { state = {}, changes = {} }) {
        this.dataID = dataID
        this.tempalte = document.body
        this.state = state
        this.changes = changes

        this.$compileAgain()
    }

    $update (doItByForce) {
        contentUpdate(this.tempalte, this.state, this.changes, this.dataID, doItByForce)
        attributeHandler(this.tempalte, this.state, this.changes)
    }

    $compileAgain () {
        compiler(document.body, this.state, this.changes, this.dataID)
    }

    $setState (setValue) {
        setValue = (typeof setValue === 'function' ? setValue() : setValue)

        for (const variableName in setValue) {
            this.state[variableName] = setValue[variableName]
        }
    }

}