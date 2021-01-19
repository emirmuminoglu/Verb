const changeHandler = async (value, changes, variableName) => {
    if (changes[variableName]) {
        return await (changes[variableName](value))
    } else {
        return value
    }
}

export const join = async (state, changes, variableName) => {
    let trueValue
    let changeValue

    if (variableName.includes('.')) {
        let routers = variableName.split('.')
        let rootMode = true
        let output = ''

        routers.map(route => {
            if (rootMode) {
                output = state[route]

                rootMode = false
            } else {
                output = output[route]
            }
        })

        trueValue = output
        await changeHandler(output, changes, variableName).then(res => changeValue = res)
    } else {
        trueValue = state[variableName]
        await changeHandler(trueValue, changes, variableName).then(res => changeValue = res)

    }
    
    return {
        trueValue: typeof trueValue === 'object' ? JSON.stringify(trueValue) : trueValue,
        changeValue: typeof changeValue === 'object' ? JSON.stringify(changeValue) : changeValue
    }
}