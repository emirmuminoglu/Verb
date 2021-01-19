const changeHandler = async (value, changes, variableName) => {
    if (changes[variableName]) {
        return await changes[variableName](value)
    } else {
        return value
    }
}

export const join = (state, changes, variableName) => {
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
        changeValue = changeHandler(output, changes, variableName)
    } else {
        trueValue = state[variableName]
        changeValue = changeHandler(trueValue, changes, variableName)
    }

    return {
        trueValue: typeof trueValue === 'object' ? JSON.stringify(trueValue) : trueValue,
        changeValue: typeof changeValue === 'object' ? JSON.stringify(changeValue) : changeValue
    }
}