import { join } from '../join.js'
import BreakPoints from '../../settings.js'

function update (element, joinResult) {
    const innerFormat = element.getAttribute('inner-format')

    if (innerFormat === 'html') {
        element.innerHTML = joinResult.changeValue
    } else if (innerFormat === 'text') {
        element.innerHTML = ''
        element.innerText = joinResult.changeValue
    }
}

export const contentUpdate = (template, state, changes, dataID, doItByForce = false) => {
    const { variableTagName } = BreakPoints
    
    template.querySelectorAll(variableTagName).forEach(async element => {
        if (element.getAttribute(dataID) !== null) {
            const variableName = element.getAttribute('dependency')
            const trueValue = element.getAttribute('true-value')
            const joinResult = await join(state, changes, variableName.trim())

            if (doItByForce) {
                update(element, joinResult)
            } else {
                if (joinResult.trueValue !== trueValue) {
                    update(element, joinResult)
                }
            }
        }
    })
}