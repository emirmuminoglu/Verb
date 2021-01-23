import { join } from '../system-functions/join.js'
import BreakPoints from '../../settings.js'
import { getVanille, setVanille } from '../system-functions/DOMVanilleObject.js'

function update (element, joinResult) {
    const innerFormat = element.getAttribute('inner-format')

    if (innerFormat === 'html') {
        element.innerHTML = joinResult.changeValue
    } else if (innerFormat === 'text') {
        element.innerHTML = ''
        element.innerText = joinResult.changeValue
    }

    setVanille(element, 'true-value', joinResult.trueValue)
}

export const contentUpdate = (template, state, changes, dataID, doItByForce = false) => {
    const { variableTagName } = BreakPoints
    
    template.querySelectorAll(variableTagName).forEach(async element => {
        if (element.getAttribute(dataID) !== null) {
            const variableName = getVanille(element, 'dependency')
            const trueValue = getVanille(element, 'true-value')
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