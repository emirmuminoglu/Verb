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
            const tree = Number(element.getAttribute(`${dynamicTagBreakPoint}tree`) === null || '' ? 0 : element.getAttribute(`${dynamicTagBreakPoint}tree`))
            const start = element.getAttribute(`${dynamicTagBreakPoint}if`)
            let root = element
        
            if (start !== null) {
                if (eval(start)) {
                    root.style.display = ''

                    for (let i = 1; i !== tree; i++) {
                        root = root.nextElementSibling

                        root.style.display = 'none'
                    }
                } else {
                    let resetRoot = root

                    for (let i = 1; i !== tree; i++) {
                        resetRoot.style.display = 'none'
                    
                        resetRoot = resetRoot.nextElementSibling
                        resetRoot.style.display = 'none'
                    }

                    for (let i = 1; i !== tree; i++) {
                        root = root.nextElementSibling
                        const query = getQueryValue(root)

                        if (eval(query)) {
                            root.style.display = ''

                            break
                        }
                    }
                }
            }
        }
    })
}