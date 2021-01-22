import BreakPoints from '../../settings.js'

const getQueryValue = (element) => {
    const { dynamicTagBreakPoint } = BreakPoints

    const name =  element.getAttributeNames().map(name => {
        if (name.includes(dynamicTagBreakPoint)) {
            return name
        }
    })[0]

    if (name !== `${dynamicTagBreakPoint}else`) {
        return element.getAttribute(name)
    } else {
        return true
    }
}

export const query = (template, state, dataID) => {
    const { dynamicTagBreakPoint } = BreakPoints

    template.querySelectorAll('*').forEach(element => {
        if (element.getAttribute(dataID) !== null) {
            const isIf = element.getAttribute(`${dynamicTagBreakPoint}if`)
            const queryElements = []

            if (isIf !== null) {
                let nextElement = element.nextElementSibling
                queryElements.push(element)

                for (let i = 0; i < 30; i++) {
                    const nextElementIsIf = nextElement.getAttribute(`${dynamicTagBreakPoint}if`)
                    const nextElementIsElseIf = nextElement.getAttribute(`${dynamicTagBreakPoint}else-if`)
                    const nextElementElse = nextElement.getAttribute(`${dynamicTagBreakPoint}else`)

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
            }

            queryElements.map(el => el.style.display = 'none')

            for (const i in queryElements) {
                const el = queryElements[i]
                const isIf = el.getAttribute(`${dynamicTagBreakPoint}if`)
                const query = getQueryValue(el)

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