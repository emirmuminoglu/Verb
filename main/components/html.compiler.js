import { join } from './join.js'

const tagChange = (variableName, trueValue, value, dataID) => {
    value = typeof value === 'object' ? JSON.stringify(value) : value
    return `<v dependency="${variableName}" true-value="${trueValue}" ${dataID}>${value}</v>`
}

const getLength = (template = document.body) => {
    return template.innerHTML.length
}

export const compiler = async (template, state, changes, dataID) => {
    const position = {start: '', end: ''}

    for (let start = 0; start < await getLength(); start++) {
        const first = template.innerText[start]
        const last = template.innerText[(start + 1)]

        if (first === '{' && last === '{') {
            for (let finish = start; finish < await getLength(); finish++) {
                const first = template.innerText[finish]
                const last = template.innerText[(finish + 1)]
                
                if (first === '}' && last === '}') {
                    position.start = await new Number(start + 2)
                    position.end = finish
                    
                    const variableName = await template.innerText.slice(position.start, position.end)
                    const joinResult = await join(state, changes, variableName.trim())
                    
                    template.innerHTML = await template.innerHTML.replace(`{{${variableName}}}`, tagChange(variableName, joinResult.trueValue, joinResult.changeValue, dataID))
                }
            }
        }
    }
}