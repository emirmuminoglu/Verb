import Settings from "../../settings.js"

export const show = (template, state, dataID, storeMode = false) => {
    const { dynamicTagBreakPoint } = Settings

    template.querySelectorAll("*").forEach(element => {
        if (element.getAttribute(dataID) !== null || storeMode) {
            const show = element.getAttribute(`${dynamicTagBreakPoint}show`)

            if (show !== null) {
                if (eval(show)) {
                    element.style.display = ""
                } else {
                    element.style.display = "none"
                }
            }
        }
    })
}