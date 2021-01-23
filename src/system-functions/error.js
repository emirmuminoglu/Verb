export const control = (item) => {
    const title = "{Vanillejs Error}"

    return {
        is({ type, value }) {
            return {
                isNot: this.isNot,
                err(content) {
                    if (item !== value || typeof item !== type) {
                        if (value === undefined) {
                            if (typeof item !== type) {
                                console.error(title + '\n' + content)
                            }
                        } else if (type === undefined) {
                            if (item === value) {
                                console.error(title + '\n' + content)
                            }
                        } else {
                            if (item !== value || typeof item !== type) {
                                console.error(title + '\n' + content)
                            }
                        }
                    }
                },
                warn(content) {
                    if (value === undefined) {
                        if (typeof item === type) {
                            console.warn(title + '\n' + content)
                        }
                    } else if (type === undefined) {
                        if (item === value) {
                            console.warn(title + '\n' + content)
                        }
                    } else {
                        if (item === value || typeof item === type) {
                            console.warn(title + '\n' + content)
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
                                console.error(title + '\n' + content)
                            }
                        } else if (type === undefined) {
                            if (item === value) {
                                console.error(title + '\n' + content)
                            }
                        } else {
                            if (item === value || typeof item === type) {
                                console.log(type, value, item)
                                console.error(title + '\n' + content)
                            }
                        }
                    }
                },
                warn(content) {
                    if (value === undefined) {
                        if (typeof item === type) {
                            console.warn(title + '\n' + content)
                        }
                    } else if (type === undefined) {
                        if (item === value) {
                            console.warn(title + '\n' + content)
                        }
                    } else {
                        if (item === value || typeof item === type) {
                            console.warn(title + '\n' + content)
                        }
                    }
                }
            }
        }
    }
}