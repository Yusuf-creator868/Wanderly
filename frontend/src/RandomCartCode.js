function RandomCartCode(length = 10){
    let result = ""
    const Alphab = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
    for (let index = 0; index < length; index++) {
        let random = Math.floor(Math.random() * Alphab.length);
        result += Alphab[random];
    }
    return result
}

export const randomValue = RandomCartCode()