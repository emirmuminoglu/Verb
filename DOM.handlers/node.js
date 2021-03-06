import Settings from "../settings.js"
import { join, getVerb, setVerb } from "../utils/distribution.js"

export const node = (verbNodeList, _this, dataID) => {
    const { dynamicTagBreakPoint } = Settings

    verbNodeList.map(element => {
        if (element.getAttribute(dataID) !== null && (element.tagName === "INPUT" || element.tagName === "TEXTAREA")) {
            const attributeNames = element.getAttributeNames(),
                nodeAttributeIndex = attributeNames.findIndex(e => e.includes(`${dynamicTagBreakPoint}node`)) // index of used node attribute

            const name = attributeNames[nodeAttributeIndex]
            let variableName = element.getAttribute(name)

            element.value = join(_this.state, name.includes("change") ? _this.changes : {}, variableName.trim()).changeValue

            // if there is not an event assignment 
            if (getVerb(element, "nodeAdd") !== true) {
                const dist = name.split("."),
                    setObj = {}

                let keyCode,
                    nodeType,
                    nodeTypeSystemName = "String"

                // keyCode control
                if (dist.join().includes("[") && dist.join().includes("]")) {
                    keyCode = dist[2].replace("[", "").replace("]", "").trim()
                } else keyCode = false

                // type control. there will be a type assignment if there is a type, if there isnt type it will be false
                if ((keyCode ? dist[3] : dist[2]) !== undefined) {
                    nodeType = (keyCode ? dist[3] : dist[2])
                } else nodeType = false

                // conversion of type name to the system name
                if (nodeType) nodeTypeSystemName = nodeType[0].toUpperCase() + nodeType.slice(1)

                // event assignment to input or textarea tag
                element.addEventListener(dist[1], (e) => {
                    // type control
                    const typeControl = () => {
                        // if type is used 

                        if (nodeType !== false) {
                            return window[nodeTypeSystemName](e.target.value)
                        } else {
                            // if is not used
                            return e.target.value
                        }
                    }

                    // suitable object format for the setstate function

                    variableName = variableName.replace("state.", "")

                    const s = variableName.split('.')
                    const last = s.splice(s.length - 1, 1)
                    let m = true
                    let b

                    s.map(e => {
                        if (m) {
                            b = _this.state[e]
                            m = false

                            return
                        }

                        b = b[e]
                    })

                    b[last] = typeControl()

                    // if there is key assignment tu?? atamas?? yap??lm???? ise
                    if (keyCode) {
                        // if assigned key is same with clicked key  atanan tu?? ile t??klanan tu?? ayn?? ise
                        if (e.keyCode == keyCode) {
                            // change function
                            _this.$setState(setObj)
                        }
                    } else _this.$setState(setObj) // change function if key is not assigned  tu?? atanmam???? ise de??i??im i??levi
                })
            }

            setVerb(element, "nodeAdd", true)
        }
    })
}