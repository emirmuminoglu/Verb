import { join } from "../system/join.js"
import { getVerb } from "../system/DOMVerbObject.js"

function update(element, joinResult) {
    const innerFormat = element.getAttribute("inner-format")

    if (innerFormat === "html") {
        element.innerHTML = joinResult.changeValue
    } else if (innerFormat === "text") {
        element.innerHTML = ""
        element.innerText = joinResult.changeValue
    }
}

export const contentUpdate = (verbElementList, state, changes, dataID) => {
    verbElementList.map(element => {
        if (element.getAttribute(dataID) !== null) {
            const variableName = getVerb(element, "dependency"),
                joinResult = join(state, changes, variableName.trim())

            update(element, joinResult)
        }
    })
}
