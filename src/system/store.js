import { contentUpdate, attributeHandler } from "../updates-and-handler/distribution.js"
import { show, query } from "../dynamic-tag-operations/distribution.js"

export class Verx {
    constructor({ maxHistorySave = 5, storeUseName = "_store", historySave = false }) {
        this.template = document.body
        this.mutations = this.changes
        this.actions = this.changes
        this.storeUseName = storeUseName
        this.$history = []
        this.maxHistorySave = maxHistorySave
        this.historySave = historySave
    }

    createStore({ changes = {}, state = {}, mutations = {}, actions = {}, updateList = [] }) {
        this.state = state
        this.mutations = mutations
        this.actions = actions
        this.updateList = updateList
        this.changes = changes

        window[this.storeUseName] = this.state
        window._storeChanges = this.changes

        this.$update()
    }

    $update(updateName, doItByForce) {
        if (updateName === undefined || updateName === "*") {
            contentUpdate(this.template, _store, this.changes, this.dataID, doItByForce, true)
            attributeHandler(this.template, _store, this.changes, this.dataID, true)
            show(this.template, _store, this.dataID, true)
            query(this.template, _store, this.dataID, true)
        } else {
            updateName === "content" ? contentUpdate(this.template, _store, this.changes, this.dataID, doItByForce, true) : null
            updateName === "attribute" ? attributeHandler(this.template, _store, this.changes, this.dataID, true) : null
            updateName === "show" ? show(this.template, _store, this.dataID, true) : null
            updateName === "query" ? query(this.template, _store, this.dataID, true) : null
        }
    }

    history(oldState, newState) {
        const historyPush = (mode, name, oldValue, newValue) => {
            this.$history.unshift({ mode, variableName: name, oldValue, newValue: newValue })

            if (this.$history.length > this.maxHistorySave) {
                this.$history.pop()
            }
        }

        for (const [name, value] of Object.entries(oldState)) {
            if (newState[name] === undefined) {
                historyPush("delete", name, value)
            } else if (JSON.stringify(value) !== JSON.stringify(newState[name])) {
                historyPush("update", name, value, newState[name])
            }
        }
    }

    async $run(mutationName, mutationParams) {
        const oldState = JSON.parse(JSON.stringify(_store))
        await this.mutations[mutationName](...mutationParams)
        const newState = _store

        if (this.updateList.includes(mutationName) || this.updateList.includes("*")) {
            this.$update("*", true)
        }

        if (this.historySave) {
            this.history(oldState, newState)
        }
    }
}