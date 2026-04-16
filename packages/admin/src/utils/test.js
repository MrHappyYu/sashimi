/* eslint-disable */
import { cloneDeep, forEach, reject, set } from 'lodash'
function myDeepClone() {
  let a = {}
  let b = cloneDeep(a, a)
}
function deepClone(value, seen = new WeakMap()) {
  // 处理基本类型和函数
  if (value === null || typeof value !== 'object') return value

  // 处理循环引用
  if (seen.has(value)) return seen.get(value)

  // 处理特殊对象类型
  if (value instanceof Date) return new Date(value.getTime())
  if (value instanceof RegExp) return new RegExp(value.source, value.flags)
  if (value instanceof Map) {
    const map = new Map()
    seen.set(value, map)
    value.forEach((v, k) => map.set(deepClone(k, seen), deepClone(v, seen)))
    return map
  }
  if (value instanceof Set) {
    const set = new Set()
    seen.set(value, set)
    value.forEach(v => set.add(deepClone(v, seen)))
    return set
  }

  // 处理普通对象和数组
  const clone = Array.isArray(value) ? [] : Object.create(Object.getPrototypeOf(value))
  seen.set(value, clone)

  for (const key of Reflect.ownKeys(value)) {
    // 包含 Symbol 键
    clone[key] = deepClone(value[key], seen)
  }
  return clone
}

function deepClone2(value, seen = new WeakMap()) {
  if (value === null || typeof value !== 'object') return value

  if (seen.has(value)) return seen.get(value)

  if (value instanceof Date) return new Date(value.getTime())
  if (value instanceof RegExp) return new RegExp(value.source, value.flags)
  if (value instanceof Map) {
    const map = new Map()
    seen.set(value, map)
    value.forEach((v, k) => map.set(deepClone2(k, seen), deepClone2(v, seen)))
    return map
  }
  if (value instanceof Set) {
    const set = new Set()
    seen.set(value, set)
    value.forEach(v => set.add(deepClone2(v, seen)))
    return set
  }
  const clone = Array.isArray(value) ? [] : Object.create(Object.getPrototypeOf(value))
  seen.set(value, clone)
  for (const key of Reflect.ownKeys(value)) {
    clone[key] = deepClone2(value[key], seen)
  }
  return clone
}

function deepClone3(value, seen = new WeakMap()) {
  if (seen.has(value)) return seen.get(value)
  if (value === null || typeof value !== 'object') return value
  if (value instanceof Date) return new Date(value.getTime())
  if (value instanceof RegExp) return new RegExp(value.source, value.flags)
  if (value instanceof Map) {
    const map = new Map()
    seen.set(value, map)
    value.forEach((v, k) => map.set(deepClone3(k, seen), deepClone3(v, seen)))
    return map
  }
  if (value instanceof Set) {
    const set = new Set()
    seen.set(value, set)
    value.forEach(v => set.add(deepClone3(v)))
    return set
  }
  const clone = Array.isArray(value) ? [] : Object.create(Object.getPrototypeOf(value))
  seen.set(value, clone)
  for (const key of Reflect.ownKeys(value)) {
    clone[key] = deepClone3(value[key])
  }
  return clone
}
// 防抖
function debounce(fn, delay) {
  let timer = null
  return function (...args) {
    clearTimeout(timer)
    timer = setTimeout(() => {
      fn.apply(this, args)
    }, delay)
  }
}
// 节流

function throttle(fn, interval) {
  let lastTime = 0
  return function (...args) {
    const now = Date.now()
    if (now - lastTime >= interval) {
      lastTime = now
      fn.apply(this, args)
    }
  }
}

function deepClone4(value, seen = new WeakMap()) {
  if (seen.has(value)) return seen.get(value)
  if (value === null || typeof value !== 'object') return value
  if (value instanceof Date) return new Date(value.getTime())
  if (value instanceof RegExp) return new RegExp(value.source, value.flags)
  if (value instanceof Map) {
    const map = new Map()
    seen.set(value, map)
    value.forEach((v, k) => map.set(deepClone4(k, seen), deepClone4(v, seen)))
    return map
  }
  if (value instanceof Set) {
    const set = new Set()
    seen.set(value, set)
    value.forEach(v => set.add(deepClone4(v)))
    return set
  }
  const clone = Array.isArray(value) ? [] : Object.create(Object.getPrototypeOf(value))
  seen.set(value, clone)
  for (const key of Reflect.ownKeys(value)) {
    clone[key] = deepClone4(value[key])
  }
  return clone
}
function debounce2(fn, delay) {
  let timer = null
  return function (...args) {
    timer = setTimeout(() => {
      clearTimeout(timer)
      fn.apply(this, args)
    }, delay)
  }
}

function throttle2(fn, interval) {
  let lastTime = 0
  return function (...args) {
    let now = Date.now()
    if (now - lastTime >= interval) {
      lastTime = now
      fn.apply(this, args)
    }
  }
}

class Animal {
  constructor(name) {
    this.name = name
  }
  // 定义在prototype上
  shround() {
    console.log(`${this.name}shround!`)
  }
  // static 定义在constructor上
  static create(name) {
    return new Animal(name)
  }
}

class Dog extends Animal {
  constructor(name, height) {
    super(name)
    this.name = name
  }
}

class MyPromise {
  constructor(executor) {
    this.state = 'pending'
    this.value = undefined
    this.onFulfilledCallbacks = []
    this.onRejectedCallbacks = []

    const resolve = value => {
      if (this.state !== 'pending') return
      this.state = 'fulfilled'
      this.value = value
      this.onFulfilledCallbacks.forEach(fn => fn(value))
    }
    const reject = reason => {
      if (this.state !== 'pending') return
      this.state = 'rejected'
      this.value = reason
      this.onRejectedCallbacks.forEach(fn => fn(reason))
    }

    try {
      executor(resolve, reject)
    } catch (e) {
      reject(e)
    }
  }

  then(onFulfilled, onRejected) {
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : v => v
    onRejected =
      typeof onRejected === 'function'
        ? onRejected
        : e => {
            throw e
          }

    return new MyPromise((resolve, reject) => {
      const handle = (fn, val) => {
        setTimeout(() => {
          // 模拟微任务（真实实现用 queueMicrotask）
          try {
            resolve(fn(val))
          } catch (e) {
            reject(e)
          }
        })
      }
      if (this.state === 'fulfilled') handle(onFulfilled, this.value)
      else if (this.state === 'rejected') handle(onRejected, this.value)
      else {
        // pending
        this.onFulfilledCallbacks.push(val => handle(onFulfilled, val))
        this.onRejectedCallbacks.push(val => handle(onRejected, val))
      }
    })
  }

  catch(onRejected) {
    return this.then(null, onRejected)
  }
  finally(onFinally) {
    return this.then(
      val => MyPromise.resolve(onFinally()).then(() => val),
      err =>
        MyPromise.resolve(onFinally()).then(() => {
          throw err
        })
    )
  }
}

class MyPromise2 {
  constructor(executor) {
    this.state = 'pending'
    this.value = undefined
    this.onFulfilledCallbacks = []
    this.onRejectedCallbacks = []
    const resolve = value => {
      if (this.state !== 'pending') return
      this.state = 'fullfilled'
      this.value = value
      this.onFulfilledCallbacks.forEach(fn => fn(value))
    }
    const reject = value => {
      if (this.state !== 'pending') return
      this.state = 'rejected'
      this.value = value
      this.onRejectedCallbacks.forEach(fn => fn(value))
    }
    try {
      executor(resolve, reject)
    } catch (e) {
      reject(e)
    }
  }

  then(onFulfilled, onRejected) {
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : v => v
    onRejected =
      typeof onRejected === 'function'
        ? onRejected
        : e => {
            throw e
          }

    return new MyPromise((resolve, reject) => {
      const handle = (fn, val) => {
        setTimeout(() => {
          try {
            resolve(fn(val))
          } catch (e) {
            reject(e)
          }
        })
      }
      if (this.state === 'fullfilled') handle(onFulfilled, this.value)
      else if (this.state === 'rejected') handle(onRejected, this.value)
      else {
        this.onFulfilledCallbacks.push(val => handle(onFulfilled, val))
        this.onRejectedCallbacks.push(val => handle(onRejected, val))
      }
    })
  }
  catch(onRejected) {
    return this.then(null, onRejected)
  }
  finally(onFinally) {
    return this.then(
      val => MyPromise.resolve(onFinally()).then(() => val),
      err =>
        MyPromise.resolve(onFinally()).then(() => {
          throw err
        })
    )
  }
}

class MyPromise3 {
  constructor(executor) {
    this.state = 'pending'
    this.value = undefined
    this.onFulfilledCallbacks = []
    this.onRejectedCallbacks = []
    const resolve = value => {
      if (this.state !== 'pending') return
      this.state = 'fullfilled'
      this.value = value
      this.onFulfilledCallbacks.forEach(fn => fn(value))
    }
    const reject = value => {
      if (this.state !== 'pending') return
      this.state = 'rejected'
      this.value = value
      this.onRejectedCallbacks.forEach(fn => fn(value))
    }
    try {
      executor(resolve, reject)
    } catch (error) {
      reject(error)
    }
  }
  then(onFulfilled, onRejected) {
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : v => v
    onRejected =
      typeof onRejected === 'function'
        ? onRejected
        : reason => {
            throw reason
          }
    return new MyPromise3((resolve, reject) => {
      const handle = (fn, val) => {
        setTimeout(() => {
          try {
            resolve(fn(val))
          } catch (e) {
            reject(e)
          }
        })
      }
      if (this.state === 'fullfilled') handle(onFulfilled, this.value)
      else if (this.state === 'rejected') handle(onRejected, this.value)
      else {
        this.onFulfilledCallbacks.push(val => handle(onFulfilled, val))
        this.onRejectedCallbacks.push(val => handle(onRejected, val))
      }
    })
  }
  catch(onRejected) {
    return this.then(null, onRejected)
  }
  finally(onFinally) {
    return this.then(
      val => MyPromise3.resolve(onFinally()).then(() => val),
      err =>
        MyPromise3.resolve(onFinally()).then(() => {
          throw err
        })
    )
  }
}

class MyPromise4 {
  constructor(executor) {
    this.state = 'pending'
    this.result = undefined
    this.onFulfilledCallbacks = []
    this.onRejectedCallbacks = []
    const resolve = value => {
      if (this.state !== 'pending') return
      this.state = 'fullfilled'
      this.result = value
      this.onFulfilledCallbacks.forEach(fn => fn(value))
    }
    const reject = value => {
      if (this.state !== 'pending') return
      this.state = 'rejected'
      this.result = value
      this.onRejectedCallbacks.forEach(fn => fn(value))
    }
    try {
      executor(resolve, reject)
    } catch (error) {
      reject(error)
    }
  }
  then(onFulfilled, onRejected) {
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : v => v
    onRejected =
      typeof onRejected === 'function'
        ? onRejected
        : e => {
            throw e
          }
    return new MyPromise4((resolve, reject) => {
      const handle = (fn, val) => {
        setTimeout(() => {
          try {
            resolve(fn(val))
          } catch (error) {
            reject(error)
          }
        })
      }
      if (this.state === 'fullfilled') {
        handle(onFulfilled, this.value)
      } else if (this.state === 'rejected') {
        handle(onRejected, this.value)
      } else {
        this.onFulfilledCallbacks.push(val => handle(onFulfilled, val))
        this.onRejectedCallbacks.push(val => handle(onRejected, val))
      }
    })
  }
  catch(onRejected) {
    return this.then(null, onRejected)
  }
  finally(onFinally) {
    return this.then(
      val => MyPromise4.resolve(onFinally()).then(() => val),
      err =>
        MyPromise4.resolve(onFinally()).then(() => {
          throw err
        })
    )
  }
}
const isPromiselike = value => {
  if (value !== null && (typeof value === 'function' || typeof value === 'Object')) {
    return typeof value.then === 'function'
  }

  return false
}

MyPromise4.all = function (promises) {
  return new MyPromise4((resolve, reject) => {
    if (!promises.length) resolve([])
    let total = 0
    const result = []
    for (let index = 0; index < promises.length; index++) {
      const promise = promises[index]
      MyPromise4.resolve(promise)
        .then(val => {
          result[index] = val
          total++
          if (total == promises.length) resolve(result)
        })
        .catch(reject)
    }
  })
}
async function concurrentLimit(tasks, limit) {
  if (!tasks.length) return false
  let index = 0
  const taskArr = new Array(tasks.length)
  const taskDeal = () => {
    const task = tasks[index]
    const i = index
    return MyPromise4.resolve(task)
      .then(val => {
        taskArr[i] = val

        index++
      })
      .catch(val => {
        taskArr[i] = val
        index++
      })
      .finally(() => {
        if (index == tasks.length) return taskArr
      })
  }
  for (let i = 0; i < limit; i++) {
    taskDeal()
  }
}
class EventEmitter {
  constructor() {
    this.events = new Map() // { eventName: [{ fn, once }] }
  }

  on(event, fn) {
    if (!this.events.has(event)) this.events.set(event, [])
    this.events.get(event).push({ fn, once: false })
    return this // 支持链式调用
  }

  once(event, fn) {
    if (!this.events.has(event)) this.events.set(event, [])
    this.events.get(event).push({ fn, once: true })
    return this
  }

  emit(event, ...args) {
    const listeners = this.events.get(event)
    if (!listeners) return false
    // 过滤掉 once 已执行的监听器
    this.events.set(
      event,
      listeners.filter(({ fn, once }) => {
        fn(...args)
        return !once
      })
    )
    return true
  }

  off(event, fn) {
    const listeners = this.events.get(event)
    if (!listeners) return this
    this.events.set(
      event,
      listeners.filter(item => item.fn !== fn)
    )
    return this
  }
}
class EventEmitter2 {
  constructor() {
    this.events = new Map()
  }
  on(event, fn) {
    if (this.events.has(event)) {
      this.events.get(event).push(fn)
    } else {
      this.events.set(event, [fn])
    }
    return this
  }
  emit(event, ...args) {
    if (this.events.has(event)) {
      this.events.get(event).forEach(fn => {
        fn(...args)
      })
    }
    return this
  }
  unsubscribe(event, fn) {
    if (this.events.has(event)) {
      if (fn) {
        this.events.set(
          event,
          this.events.get(event).filter(item => item != fn)
        )
      } else {
        this.events.delete(event)
      }
    }
  }
}

class Dep {
  static target = null // 当前正在计算的 Watcher
  constructor() {
    this.subs = []
  }
  depend() {
    if (Dep.target) this.subs.push(Dep.target)
  }
  notify() {
    this.subs.forEach(watcher => watcher.update())
  }
}

function defineReactive(obj, key, val) {
  const dep = new Dep()

  // 递归处理嵌套对象
  if (typeof val === 'object' && val !== null) observe(val)

  Object.defineProperty(obj, key, {
    get() {
      dep.depend() // 读取时收集依赖（把当前 Watcher 加入订阅列表）
      return val
    },
    set(newVal) {
      if (newVal === val) return
      val = newVal
      if (typeof newVal === 'object') observe(newVal) // 新值也需要观测
      dep.notify() // 赋值时通知所有订阅的 Watcher 更新
    },
    enumerable: true,
    configurable: true,
  })
}
// 4. observe — 遍历对象所有属性
function observe(obj) {
  Object.keys(obj).forEach(k => defineReactive(obj, k, obj[k]))
}

class Dep {
  constructor() {
    this.subs = []
  }
  static target = null
  depend() {
    if (Dep.target) this.subs.push(Dep.target)
  }
  notify() {
    this.subs.forEach(watcher => {
      watcher.update()
    })
  }
}
function defineReactive2(obj, key, val) {
  const dep = new Dep()
  if (typeof val === 'object' && val !== 'null') observe(val)
  Object.defineProperty(obj, key, {
    get() {
      dep.depend()
      return val
    },
    set(newVal) {
      if (newVal !== val) {
        val = newVal
        if (typeof newVal === 'object' && newVal !== 'null') observe(newVal)
        dep.notify()
      }
    },
    enumerable: true,
    configurable: true,
  })
}
function observe(obj) {
  for (const key of obj) {
    defineReactive2(obj, key, obj[key])
  }
}

class Dep {
  constructor() {
    this.subs = []
  }
  static target = null
  depend() {
    if (this.target) this.subs.push(this.target)
  }
  notify() {
    this.subs.forEach(watcher => watcher.update())
  }
}
function defineReactive3(obj, key, val) {
  const dep = new Dep()
  if (typeof val === 'object' && val !== null) observe(val)
  Object.defineProperty(obj, key, {
    get() {
      dep.depend()
      return val
    },
    set(newVal) {
      if (val === newVal) return
      val = newVal
      if (typeof newVal === 'object' && val !== null) observe(newVal)
      dep.notify()
    },
  })
}
function observe(obj) {
  for (const key of obj) {
    defineReactive3(obj, key, obj[key])
  }
}

// 观察者模式

Promise.all = function (psArr) {
  let total = psArr.length
  let dealNum = 0
  let res = []
  psArr.forEach((ps, ind) => {
    ps.then(data => {
      res[ind] = data
      dealNum++
    }).catch(() => {
      return Promise.reject(res)
    })
  })
  if (dealNum == total) {
    return Promise.resolve(res)
  }
}

class EventBus {
  constructor() {
    this.events = new Map()
  }
  on(event, fn) {
    if (this.events.has(event)) {
      this.events.get(event).add(fn)
    } else {
      this.events.set(event, new Set().add(fn))
    }
  }
  emit(event, data) {
    if (this.events.has(event)) {
      this.events.get(event).forEach(fn => fn())
    }
  }
  off(event, fn) {
    if (this.events.has(event)) {
      this.events.get(event).delete(fn)
    }
  }
}

function deepClone6(target, seen = new WeakMap()) {
  if (typeof target !== 'object' || target == null) return target
  if (seen.has(target)) return seen.get(target)
  if (target instanceof Date) return new Date(target)
  if (target instanceof RegExp) return new RegExp(target.source, target.flags)

  let clone = Array.isArray(target) ? [] : Object.create(Object.getPrototypeOf(target))
  seen.set(target, clone)
  for (const key of Reflect.ownKeys(target)) {
    clone[key] = deepClone6(target[key], seen)
  }
  return clone
}

function myNew(Constructor, ...args) {
  let obj = Object.create(Object.getPrototypeOf(Constructor))
  let result = Constructor.apply(obj, args)
  return result instanceof Object ? result : obj
}
