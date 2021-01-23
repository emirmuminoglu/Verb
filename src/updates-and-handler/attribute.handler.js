import { join } from "../system-functions/join.js"
import Settings from "../../settings.js"

export const attributeHandler = (template, state, changes, dataID) => {
    const { dynamicTagAttributeBreakPoint } = Settings

    template.querySelectorAll("*").forEach(element => {
        if (element.getAttribute(dataID) !== null) {
            element.getAttributeNames().map(async attributeText => {
                if (attributeText.includes(dynamicTagAttributeBreakPoint) && attributeText !== `${dynamicTagAttributeBreakPoint}change`) {
                    const attributeName = attributeText.replace(dynamicTagAttributeBreakPoint, "").trim(),
                    variableName = element.getAttribute(attributeText),
                    changeMode = element.getAttribute(`${dynamicTagAttributeBreakPoint}change`),
                    elementValue = element.getAttribute(attributeName.trim()) !== null ? element.getAttribute(attributeName) : "",
                    joinResult = await join(state, changeMode !== null ? changes : {}, variableName)

                    
                    if (element.getAttribute("processed") !== null) {
                        if (joinResult.trueValue !== undefined) {
                            const newValue = elementValue.split(" ")

                            newValue[(newValue.length - 1)] = joinResult.changeValue
                            element.setAttribute(attributeName, newValue.join(" "))
                        }
                    } else {
                        element.setAttribute("processed", "")
                        element.setAttribute(attributeName, (
                            elementValue + (
                                elementValue === "" ? "" : " "
                            ) + joinResult.changeValue)
                        )
                    }
                }
            })
        }
    })
}