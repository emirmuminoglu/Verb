import Settings from "../../settings.js"
import { join } from "../system/join.js"
import { getVerb, setVerb } from "../system/DOMVerbObject.js"

export const node = (template, _this, dataID) => {
    const { dynamicTagBreakPoint } = Settings

    template.querySelectorAll("*").forEach(element => {
        if (element.getAttribute(dataID) !== null || element.getAttribute("store") !== null) {
            const attributeNames = element.getAttributeNames(),
                nodeAttributeIndex = attributeNames.findIndex(e => e.includes(`${dynamicTagBreakPoint}node`))

            if (nodeAttributeIndex !== -1) {
                const name = attributeNames[nodeAttributeIndex],
                    variableName = element.getAttribute(name)

                element.value = join(_this.state, name.includes("change") ? _this.changes : {}, variableName.trim()).changeValue

                if (getVerb(element, "nodeAdd") !== true) {
                    const dist = name.split("."),
                        setObj = {}

                    if (element.tagName === "INPUT" || element.tagName === "TEXTAREA") {
                        const keyCode = (dist.join().includes("[") && dist.join().includes("]")) ? dist[2].replace("[", "").replace("]", "").trim() : false,
                            nodeType = (keyCode ? dist[3] : dist[2]) !== undefined ? (keyCode ? dist[3] : dist[2]) : false,
                            nodeTypeSystemName = nodeType ? nodeType[0].toUpperCase() + nodeType.slice(1) : ""

                        element.addEventListener(dist[1], (e) => {
                            const typeControl = () => {
                                if (nodeType !== false) {
                                    return window[nodeTypeSystemName](e.target.value)
                                } else {
                                    return e.target.value
                                }
                            }

                            setObj[variableName.replace("state.", "")] = typeControl()

                            if (keyCode !== false) {
                                if (e.keyCode == keyCode) {
                                    _this.$setState(setObj)
                                }
                            } else _this.$setState(setObj)
                        })
                    }
                }
            }

            setVerb(element, "nodeAdd", true)
        }
    })
}