import { compiler } from './html.compiler.js'
import { contentUpdate } from './updates/distribution.js'

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
    }

    $compileAgain () {
        compiler(document.body, this.state, this.changes, this.dataID)
    }
}