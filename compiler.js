import { join } from './utils/join.js'
import Settings from "./settings.js"

const tagChange = (variableName, trueValue, value, dataID, innerFormat) => {
    const { variableTagName } = Settings

    return `
        <${variableTagName}
            dependency='${variableName}'
            inner-format="${innerFormat ? 'html' : 'text'}"
            ${dataID}
        >${value}
        </${variableTagName}>
    `
}

export const compiler = (template, state, changes, dataID) => {
    const { useVariableStart, useVariableEnd, useHTMLMark, useVariableLength, compilerMaximumTransactionLimit } = Settings

    if ((template.innerHTML.indexOf(useVariableStart) !== -1) && (template.innerHTML.indexOf(useVariableEnd) !== -1)) {
        for (let i = 0; i < template.innerHTML.length; i++) {
            const start = (template.innerHTML.indexOf(useVariableStart) + useVariableLength),
                end = template.innerHTML.indexOf(useVariableEnd)

            if ((start !== -1 && end !== -1) || (i == compilerMaximumTransactionLimit)) {
                const variableName = template.innerHTML.slice(start, end),
                    innerFormat = variableName.includes(useHTMLMark),
                    joinResult = join(state, changes, variableName.replace(useHTMLMark, "").trim())

                template.innerHTML = template.innerHTML.replace(`${useVariableStart}${variableName}${useVariableEnd}`,
                    tagChange(
                        variableName.replace(useHTMLMark, ""),
                        joinResult.trueValue,
                        joinResult.changeValue,
                        dataID,
                        innerFormat
                    )
                )
            } else break
        }
    }

    return template
}