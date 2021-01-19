import { join } from './join.js'
import BreakPoints from './settings.js'

const tagChange = (variableName, trueValue, value, dataID) => {
    const { variableTagName } = BreakPoints

    return `<${variableTagName} dependency="${variableName}" true-value="${trueValue}" ${dataID}>${value}</${variableTagName}>`
}

export const compiler = async (template, state, changes, dataID) => {
    const { useVariableStart, useVariableEnd } = BreakPoints

    for (let i = 0; i < template.innerText.length; i++) {
        const start = (template.innerText.indexOf(useVariableStart) + 2)
        const end = template.innerText.indexOf(useVariableEnd)

        if (start !== -1 && end !== -1) {
            const variableName = template.innerText.slice(start, end)
            const joinResult = await join(state, changes, variableName)
            
            template.innerHTML = template.innerHTML.replace(`${useVariableStart}${variableName}${useVariableEnd}`,
                tagChange(variableName, joinResult.trueValue, joinResult.changeValue, dataID)
            )
        }
    }

    return template
}