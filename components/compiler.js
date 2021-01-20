import { join } from './join.js'
import BreakPoints from './settings.js'

const tagChange = (variableName, trueValue, value, dataID) => {
    const { variableTagName } = BreakPoints

    return `<${variableTagName} dependency="${variableName}" true-value="${trueValue}" ${dataID}>${value}</${variableTagName}>`
}

export const compiler = (template, state, changes, dataID) => {
    const { useVariableStart, useVariableEnd } = BreakPoints

    if (!template.innerText.indexOf(useVariableStart) && template.innerText.indexOf(useVariableEnd)) {
        for (let i = 0; i < template.innerText.length; i++) {
            const start = (template.innerText.indexOf(useVariableStart) + 2)
            const end = template.innerText.indexOf(useVariableEnd)

            if (start !== -1 && end !== -1) {
                const variableName = template.innerText.slice(start, end)
                const joinResult = join(state, changes, variableName)
            
                template.innerHTML = template.innerHTML.replace(`${useVariableStart}${variableName}${useVariableEnd}`,
                    tagChange(variableName, joinResult.trueValue, joinResult.changeValue, dataID)
                )
            } else {
                break
            }
        }
    }

    return template
}