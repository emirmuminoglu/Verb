import { control } from "./error.js"

const changeHandler = (value, changes, variableName) => {
    if (changes[variableName]) {
        return changes[variableName](value)
    } else {
        return value
    }
}

export const join = (state, changes, variableName) => {
    let trueValue
    let changeValue

    if (variableName.includes(".")) {
        let routers = variableName.split("."),
        rootMode = true,
        output = ""

        routers.map(route => {
            if (rootMode) {
                output = state[route]

                rootMode = false
            } else {
                output = output[route]
            }

            control(`${output}`).isNot({ value: "undefined" }).err(`A value named ${variableName} was not found in state. Check the values ​​you use in HTML`)
        })

        trueValue = output
        changeValue = changeHandler(output, changes, variableName)
    } else {
        control(`${state[variableName]}`).isNot({ value: "undefined" }).err(`A value named ${variableName} was not found in state. Check the values ​​you use in HTML`)
        trueValue = state[variableName]
        changeValue = changeHandler(trueValue, changes, variableName)
    }

    return {
        trueValue: typeof trueValue === "object" ? JSON.stringify(trueValue) : trueValue,
        changeValue: typeof changeValue === "object" ? JSON.stringify(changeValue) : changeValue
    }
}