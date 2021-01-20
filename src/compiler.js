import { join } from './join.js'
import BreakPoints from '../settings.js'

const tagChange = (variableName, trueValue, value, dataID, innerFormat) => {
    const { variableTagName } = BreakPoints

    return `
        <${variableTagName}
            dependency="${variableName}"
            true-value="${trueValue}"
            inner-format="${innerFormat ? 'html' : 'text'}"
            ${dataID}
        >${value}
        </${variableTagName}>
    `
}

export const compiler = (template, state, changes, dataID) => {
    const { useVariableStart, useVariableEnd, useHTMLMark } = BreakPoints

    if (template.innerText.indexOf(useVariableStart) !== -1 && template.innerText.indexOf(useVariableEnd) !== -1) {
        for (let i = 0; i < template.innerText.length; i++) {
            const start = (template.innerText.indexOf(useVariableStart) + 2)
            const end = template.innerText.indexOf(useVariableEnd)

            if (start !== -1 && end !== -1) {
                const variableName = template.innerText.slice(start, end)
                const innerFormat = variableName.includes(useHTMLMark)
                const joinResult = join(state, changes, variableName.replace(useHTMLMark, '').trim())

                template.innerHTML = template.innerHTML.replace(`${useVariableStart}${variableName}${useVariableEnd}`,
                    tagChange(variableName.replace(useHTMLMark, ''), joinResult.trueValue, joinResult.changeValue, dataID, innerFormat)
                )
            } else {
                break
            }
        }
    }

    return template
}