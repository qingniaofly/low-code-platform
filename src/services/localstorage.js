function safeJSON(str) {
    let o
    try {
        o = JSON.parse(str)
    } catch (e) {}
    return o
}

class LocalStorage {
    domain = 'app'

    constructor(key) {
        this.domain = key
    }

    get(key) {
        if (!key) {
            return
        }
        const k = `${this.domain}-${key}`
        return safeJSON(localStorage.getItem(k))
    }

    set(key, value) {
        const k = `${this.domain}-${key}`
        localStorage.setItem(k, JSON.stringify(value))
    }

    delete(key) {
        const k = `${this.domain}-${key}`
        localStorage.removeItem(k)
    }
}

export default LocalStorage
