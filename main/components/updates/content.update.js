import { join } from '../join.js'

export const contentUpdate = (template, state, changes, dataID, doItByForce = false) => {
    template.querySelectorAll('v').forEach(element => {
        if (element.getAttribute(dataID) !== null) {
            const variableName = element.getAttribute('dependency')
            const trueValue = element.getAttribute('true-value')
            const joinResult = join(state, changes, variableName)

            if (doItByForce) {
                element.innerText = joinResult.changeValue
                element.setAttribute('true-value', joinResult.trueValue)
            } else {
                if (joinResult.trueValue !== trueValue) {
                    element.innerText = joinResult.changeValue
                    element.setAttribute('true-value', joinResult.trueValue)
                }
            }
        }
    })
}