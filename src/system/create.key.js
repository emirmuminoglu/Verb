export const createKey = () => {
    let key = "data-l-"

    for (let i = 0; i < 3; i++) {
        const alphabet = "abcdefghijklmnoprsjtuvyz",
            randomNum = Math.floor(Math.random() * 10),
            randomAph = Math.floor(Math.random() * alphabet.length)

        key += randomNum + alphabet[randomAph]
    }

    return key
}