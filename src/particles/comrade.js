export const comradeHandler = (comrades = {}, oldV, newV) => {
    for (const [name, value] of Object.entries(newV)) {
        if (JSON.stringify(oldV[name]) !== JSON.stringify(value) && oldV[name] !== undefined) {
            if (comrades[name] !== undefined) {
                comrades[name](value, oldV[name])
            }
        }
    }
}