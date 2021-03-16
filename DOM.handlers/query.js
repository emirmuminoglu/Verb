import Settings from '../settings.js'

const getQueryValue = (element) => {
    const { dynamicTagBreakPoint } = Settings

    const name = element.getAttributeNames().map(name => {
        if (name.includes(dynamicTagBreakPoint)) {
            return name
        }
    })

    if (name[0] !== `${dynamicTagBreakPoint}else`) {
        return element.getAttribute(name[0])
    } else {
        return true
    }
}

export const query = (verbQueryList, state, dataID) => {
    const { dynamicTagBreakPoint } = Settings

    verbQueryList.map(element => {
        if (element.getAttribute(dataID) !== null) {
            const queryElements = []

            let nextElement = element.nextElementSibling
            queryElements.push(element)

            for (let i = 0; i < 30; i++) {
                const nextElementIsIf = nextElement !== null ? nextElement.getAttribute(`${dynamicTagBreakPoint}if`) : null,
                    nextElementIsElseIf = nextElement !== null ? nextElement.getAttribute(`${dynamicTagBreakPoint}else-if`) : null,
                    nextElementElse = nextElement != null ? nextElement.getAttribute(`${dynamicTagBreakPoint}else`) : null

                if (nextElementIsIf === null) {
                    if (nextElementIsElseIf !== null) {
                        queryElements.push(nextElement)
                    } else if (nextElementElse !== null) {
                        queryElements.push(nextElement)

                        break
                    } else {
                        break
                    }
                }

                nextElement = nextElement.nextElementSibling
            }

            queryElements.map(el => el.style.display = "none")

            for (const i in queryElements) {
                const el = queryElements[i],
                    isIf = el.getAttribute(`${dynamicTagBreakPoint}if`),
                    query = getQueryValue(el)

                if (isIf !== null && eval(query)) {
                    el.style.display = ''

                    break
                } else if (eval(query)) {
                    el.style.display = ''

                    break
                }
            }
        }
    })
}