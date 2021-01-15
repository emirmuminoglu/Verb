import { join } from './join.js'

const tagChange = (variableName, trueValue, value, dataID) => {
    value = typeof value === 'object' ? JSON.stringify(value) : value
    return `<v dependency="${variableName}" true-value="${trueValue}" ${dataID}>${value}</v>`
}

export const compiler = (template, state, changes, dataID) => {
    for (let i = 0; i < template.innerHTML.length; i++) {
        const start = (template.innerText.indexOf('{{') + 2)
        const end = template.innerText.indexOf('}}')

        if (start !== -1 && end !== -1) {
            const variableName = template.innerText.slice(start, end)
            const joinResult = join(state, changes, variableName)
            
            template.innerHTML = template.innerHTML.replace(`{{${variableName}}}`,
                tagChange(variableName, joinResult.trueValue, joinResult.changeValue, dataID)
            )
        }
    }

    return template
}