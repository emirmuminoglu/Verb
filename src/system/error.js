export const control = (controlValue) => {
    const title = "{Verbjs Error}",
    suggestions = `
If you haven"t solved the problem you can check here

Repository: https://github.com/Verbjs/verb
Issues: https://github.com/Verbjs/verb/issues
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
