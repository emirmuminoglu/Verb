import Settings from "../../settings.js"

export const show = (verbShowList, state, dataID) => {
    const { dynamicTagBreakPoint } = Settings

    verbShowList.map(element => {
        if (element.getAttribute(dataID) !== null) {
            const show = element.getAttribute(`${dynamicTagBreakPoint}show`)

            if (eval(show)) element.style.display = ""
            else element.style.display = "none"
        }
    })
}