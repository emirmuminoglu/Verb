export const control = (controlValue) => {
    const title = "{Vanillejs Error}",
    suggestions = `
If you haven"t solved the problem you can check here

Repository: https://github.com/Vanillejs/vanille
Issues: https://github.com/Vanillejs/vanille/issues
`

    return {
        err(errorMessage) {
            if (!controlValue) {
                console.error(title, errorMessage, suggestions)
            }
        },
        warn(warnMessage) {
            if (!controlValue) {
                console.warn(title, warnMessage, suggestions)
            }
        }
    }
}
