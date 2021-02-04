export const comradeHandler = (comrades = {}, oldV, newV) => {
    for (const [name, value] of Object.entries(newV)) {

        if (oldV[name] !== undefined) {
            if (JSON.stringify(oldV[name]) !== JSON.stringify(value)) {
                if (comrades[name] !== undefined) {
                    comrades[name](value, oldV[name])
                }
            }
        }
    }
}