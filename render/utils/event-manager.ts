/**
 * 通知事件 KEY
 */
export const eventKey: string = 'GAODING_NATIVE_BRIDGE_EVENT_KEY'

type EventCallback = (data: any) => void

// 事件管理器
export class GNBEventManager {
  private static instance: GNBEventManager

  // 事件名称与事件 key 的映射
  // eventName: keys
  private eventKeys: Map<string, Array<string>> = new Map()

  // 事件 key 与对应的回调函数的映射
  // key: callback
  private callbacks: Map<string, EventCallback> = new Map()

  static get shared(): GNBEventManager {
    if (!GNBEventManager.instance) {
      GNBEventManager.instance = new GNBEventManager()
    }
    return GNBEventManager.instance
  }

  /**
   * 在全局注册 GNBEventManager
   * 全局范围内注册了一个事件监听器，监听 eventKey 事件。
   * 当事件被触发时，它会从事件的 detail 属性中获取事件名称和数据，然后遍历所有注册的回调函数并执行它们
   */
  register() {
    window.addEventListener(eventKey as any, (event: CustomEvent) => {
      const detail = event.detail
      const eventName = detail.eventName
      const data = detail.data
      const keys = this.eventKeys.get(eventName)
      if (keys) {
        keys.forEach((key) => {
          const callback = this.callbacks.get(key)
          callback && callback(data)
        })
      }
    })
  }

  /**
   * 注册监听事件
   * 根据事件名称和事件源生成一个唯一的 key，并将该 key 与回调函数一起存储在相应的 Map 中
   */
  on(source: any, eventName: string, callback: EventCallback) {
    const key = this.getKey(eventName, source)
    let keys = this.eventKeys.get(eventName)
    if (!keys) {
      keys = []
      this.eventKeys.set(eventName, keys)
    }
    keys.push(key)
    this.callbacks.set(key, callback)
  }

  /**
   * 注销监听事件
   * 根据事件名称和事件源生成 key，然后从相应的 Map 中删除该 key 及其对应的回调函数
   */
  off(source: any, eventName: string) {
    const key = this.getKey(eventName, source)
    const keys = this.eventKeys.get(eventName)
    if (keys) {
      const index = keys.indexOf(key)
      if (index !== -1) {
        keys.splice(index, 1)
      }
    }
    this.callbacks.delete(key)
  }

  /**
   * 事件名拼接事件来源标识符，生成一个唯一的标识符，用于标识事件监听的来源
   */
  private getKey(eventName: string, source: any) {
    return eventName + '&' + Symbol(source).description
  }
}
