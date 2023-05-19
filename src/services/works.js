import LocalStorage from './localstorage'

const storage = new LocalStorage('works')

class WorksAPI {
    getList() {
        let list = storage.get('list')
        if (!Array.isArray(list)) {
            list = []
        }
        return list
    }

    setList(list) {
        storage.set('list', list)
    }

    find(id) {
        return this.getList().find((r) => r.id === id)
    }

    add(record) {
        const list = this.getList()
        const exist = list.find((r) => r?.id === record?.id)
        if (exist) {
            console.error('code has exist:', record)
            this.update(record)
            return
        }
        list.push(record)
        storage.set('list', list)
    }

    update(record) {
        const list = this.getList()
        for (let i = 0, len = list.length; i < len; i++) {
            if (list[i]?.id === record?.id) {
                list[i] = { ...list[i], ...record }
                break
            }
        }
        storage.set('list', list)
    }

    delete(id) {
        const list = this.getList()
        const index = list.findIndex((r) => r?.id === id)
        list.splice(index, 1)
        storage.set('list', list)
    }
}

const worksAPI = new WorksAPI()

function async(callback, time = 500) {
    return new Promise((resolve) => {
        setTimeout(() => {
            const ret = callback()
            resolve(ret)
        }, time)
    })
}

export function add(record) {
    return async(() => worksAPI.add(record))
}

export function getList() {
    return async(() => worksAPI.getList())
}

export function update(record) {
    return async(() => worksAPI.update(record))
}

export function remove(id) {
    return async(() => worksAPI.delete(id))
}

export function find(id) {
    return async(() => worksAPI.find(id))
}

export function setMockData(list) {
    worksAPI.setList(list)
}
