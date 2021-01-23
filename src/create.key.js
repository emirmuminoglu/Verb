export const createKey = () => {
    let defaultKey = 'data-l-'
    
    for (let i = 0; i < 3; i++) {
        const alphabet = 'abcdefghijklmnoprsjtuvyz'
        const randomNum = Math.floor(Math.random() * 10)
        const randomAph = Math.floor(Math.random() * alphabet.length)
        defaultKey += randomNum + alphabet[randomAph]
    }

    return defaultKey
}