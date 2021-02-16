export const test = (title, { max, repeat }, _function) =>{
    return new Promise(async (resolve, reject) => {
        let timer = 0
        const timerInterval = setInterval(() => timer++, 0),
            returns = []

        for (let i = 0; i < repeat; i++) {
            returns.push(await _function())
        }

        clearInterval(timerInterval)

        const result = (`@ ${title}
time: ${timer}ms
max time: ${max}ms
test result: ${timer > max ? 'failed' : 'success'}
test function returns: ${JSON.stringify(returns)}
`)

        if (timer <= max) {
            resolve(result)
        } else reject(result)

        return timer > max ? false : true
    })
}