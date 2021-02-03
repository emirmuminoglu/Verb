import { contentUpdate, attributeHandler } from "../updates-and-handler/distribution.js"
import { show, query, node } from "../dynamic-tag-operations/distribution.js"
import { error } from "./error.js"

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

    createStore({ changes = {}, state = {}, mutations = {}, actions = {} }) {
        this.state = state
        this.mutations = mutations
        this.actions = actions
        this.changes = changes

        window[this.storeUseName] = this.state
        window._storeChanges = this.changes
    }

    $update(updateName, doItByForce) {
        if (updateName === undefined || updateName === "*") {
            contentUpdate(this.template, window[this.storeUseName], this.changes, this.dataID, doItByForce)
            attributeHandler(this.template, window[this.storeUseName], this.changes, this.dataID)
            show(this.template, window[this.storeUseName], this.dataID)
            query(this.template, window[this.storeUseName], this.dataID)
            node(this.template, this, this.dataID)
        } else {
            updateName === "content" ? contentUpdate(this.template, window[this.storeUseName], this.changes, this.dataID, doItByForce) : null
            updateName === "attribute" ? attributeHandler(this.template, window[this.storeUseName], this.changes, this.dataID) : null
            updateName === "show" ? show(this.template, window[this.storeUseName], this.dataID) : null
            updateName === "query" ? query(this.template, window[this.storeUseName], this.dataID) : null
            updateName === "node" ? node(this.template, this, this.dataID) : null
        }
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

    history(oldState, newState, mutationName, mutationParams) {
        const historyPush = (mode, name, oldValue, newValue) => {
            this.$history.unshift({
                mode,
                variableInfo: { variableName: name, oldValue, newValue: newValue, },
                mutationName,
                mutationParams
            })

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

    $run(mutationName, mutationParams = []) {
        if (this.mutations[mutationName] !== undefined) {
            const oldState = {...window[this.storeUseName]}
            this.mutations[mutationName](...mutationParams)
            this.$update("*", true)
            const newState = window[this.storeUseName]

            if (this.historySave) {
                this.history(oldState, newState, mutationName, mutationParams)
            }
        } else {
            error(`Could not run because a mutation named "${mutationName}" was not found`);
        }
    }
}