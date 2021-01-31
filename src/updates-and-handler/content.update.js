import { join } from "../system/join.js"
import Settings from "../../settings.js"
import { getVerb, setVerb } from "../system-functions/DOMVerbObject.js"

function update(element, joinResult) {
    const innerFormat = element.getAttribute("inner-format")

    if (innerFormat === "html") {
        element.innerHTML = joinResult.changeValue
    } else if (innerFormat === "text") {
        element.innerHTML = ""
        element.innerText = joinResult.changeValue
    }

    setVerb(element, "true-value", joinResult.trueValue)
}

export const contentUpdate = (template, state, changes, dataID, doItByForce = false) => {
    const { variableTagName } = Settings

    template.querySelectorAll(variableTagName).forEach(async element => {
        if (element.getAttribute(dataID) !== null) {

            const variableName = getVerb(element, "dependency")

            const trueValue = getVerb(element, "true-value"),
                joinResult = await join(state, changes, variableName.trim())

            if (doItByForce) {
                update(element, joinResult)
            } else {
                if (joinResult.trueValue !== trueValue) {
                    update(element, joinResult)
                }
            }
        }
    })
}
