import { join } from './join.js'

const tagChange = (variableName, trueValue, value, dataID) => {
    return `<v dependency="${variableName}" true-value="${trueValue}" ${dataID}>${value}</v>`
}

export const compiler = (template, state, changes, dataID) => {
    const length = template.innerText.length

    for (let start = 0; start < length; start++) {
        const position = {}
        const first = template.innerText[start]
        const last = template.innerText[(start + 1)]

        if (first === '{' && last === '{') {
            position.start = Number(start + 2)

            for (let finish = start; finish < length; finish++) {
                const first = template.innerText[finish]
                const last = template.innerText[(finish + 1)]

                if (first === '}' && last === '}') {
                    position.end = finish

                    break
                }
            }

            const variableName = template.innerText.slice(position.start, position.end)
            const joinResult = join(state, changes, variableName.trim())

            template.innerHTML = template.innerHTML.replace(`{{${variableName}}}`, tagChange(variableName, joinResult.trueValue, joinResult.changeValue, dataID))
        }
    }
}