export const createReactiveObject = (obj) => {
    const map = new WeakMap()

    for (const key in obj) {
        if (typeof obj[key] === 'object') {
            createReactiveObject(obj[key])
        } else if (!key.includes('@')) {
            map.set(obj, { ...obj })

            Object.defineProperty(obj, key, {
                get() {
                    return map.get(obj)[key]
                },
                set(value) {
                    map.get(obj)[key] = value

                    map.get(obj)['@' + key]()
                }
            })
        }
    }

    return obj
}