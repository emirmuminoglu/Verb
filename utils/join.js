const changeHandler = (value, changes, variableName) => {
    if (changes[variableName]) {
        return changes[variableName](value)
    } else return value
}

export const join = (state, changes, variableName) => {
    const trueValue = eval(variableName),
        changeValue = changeHandler(trueValue, changes, variableName, state)

    return {
        trueValue: typeof trueValue === "object" ? JSON.stringify(trueValue) : trueValue,
        changeValue: typeof changeValue === "object" ? JSON.stringify(changeValue) : changeValue
    }
}