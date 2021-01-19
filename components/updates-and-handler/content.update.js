import { join } from '../join.js'
import BreakPoints from '../settings.js'

export const contentUpdate = (template, state, changes, dataID, doItByForce = false) => {
    const { variableTagName } = BreakPoints

    template.querySelectorAll(variableTagName).forEach(element => {
        if (element.getAttribute(dataID) !== null) {
            const variableName = element.getAttribute('dependency')
            const trueValue = element.getAttribute('true-value')
            const joinResult = join(state, changes, variableName.trim())

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