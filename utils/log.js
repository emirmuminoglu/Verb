export const log = {
    title: '{Verb Message}',
    err(...msg) {
        console.error(this.title, ...msg)
    },
    warn() {

    }
}