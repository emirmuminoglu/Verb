const getQueryValue = (element) => {
    const name =  element.getAttributeNames().map(name => {
        if (name.includes('@')) {
            return name
        }
    })[0]

    if (name !== '@else') {
        return element.getAttribute(name)
    } else {
        return true
    }
}

export const query = (template, state) => {
    template.querySelectorAll('*').forEach(element => {
        const tree = Number(element.getAttribute('@tree') === null || '' ? 0 : element.getAttribute('@tree'))
        const start = element.getAttribute('@if')
        let root = element

        if (start !== null) {
            if (eval(start)) {
                root.style.display = 'unset'

                for (let i = 0; i !== tree; i++ ) {
                    root = root.nextElementSibling

                    root.style.display = 'none'
                }
            } else {
                let resetRoot = root

                for (let i = 0; i !== tree; i++ ) {
                    resetRoot.style.display = 'none'
                    
                    resetRoot = resetRoot.nextElementSibling
                    resetRoot.style.display = 'none'
                }

                for (let i = 0; i !== tree; i++ ) {
                    root = root.nextElementSibling
                    const query = getQueryValue(root)

                    if (eval(query)) {
                        root.style.display = 'unset'

                        break
                    }
                }
            }
        }
    })
}