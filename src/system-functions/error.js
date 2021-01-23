export const control = (item) => {
    const title = "{Vanillejs Error}"
    const suggetsions = `
If you haven't solved the problem you can check here

Repository: https://github.com/Vanillejs/vanille
Issues: https://github.com/Vanillejs/vanille/issues
`

    return {
        basicError(content) {
            console.error(title + '\n', ...content, '\n' + suggetsions)
        },
        is({ type, value }) {
            return {
                isNot: this.isNot,
                err(content) {
                    if (item !== value || typeof item !== type) {
                        if (value === undefined) {
                            if (typeof item !== type) {
                                console.error(title + '\n' + content + '\n' + suggetsions)
                            }
                        } else if (type === undefined) {
                            if (item === value) {
                                console.error(title + '\n' + content + '\n' + suggetsions)
                            }
                        } else {
                            if (item !== value || typeof item !== type) {
                                console.error(title + '\n' + content + '\n' + suggetsions)
                            }
                        }
                    }
                },
                warn(content) {
                    if (value === undefined) {
                        if (typeof item === type) {
                            console.warn(title + '\n' + content + '\n' + suggetsions)
                        }
                    } else if (type === undefined) {
                        if (item === value) {
                            console.warn(title + '\n' + content + '\n' + suggetsions)
                        }
                    } else {
                        if (item === value || typeof item === type) {
                            console.warn(title + '\n' + content + '\n' + suggetsions)
                        }
                    }
                }
            }
        },
        isNot({ type, value }) {
            return {
                is: this.is,
                err(content) {
                    if (item === value || typeof item === type) {
                        if (value === undefined) {
                            if (typeof item === type) {
                                console.error(title + '\n' + content + '\n' + suggetsions)
                            }
                        } else if (type === undefined) {
                            if (item === value) {
                                console.error(title + '\n' + content + '\n' + suggetsions)
                            }
                        } else {
                            if (item === value || typeof item === type) {
                                console.log(type, value, item)
                                console.error(title + '\n' + content + '\n' + suggetsions)
                            }
                        }
                    }
                },
                warn(content) {
                    if (value === undefined) {
                        if (typeof item === type) {
                            console.warn(title + '\n' + content + '\n' + suggetsions)
                        }
                    } else if (type === undefined) {
                        if (item === value) {
                            console.warn(title + '\n' + content + '\n' + suggetsions)
                        }
                    } else {
                        if (item === value || typeof item === type) {
                            console.warn(title + '\n' + content + '\n' + suggetsions)
                        }
                    }
                }
            }
        }
    }
}