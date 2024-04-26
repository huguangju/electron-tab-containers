/* eslint-disable no-unused-vars */
import { IpcMainEvent, IpcMainInvokeEvent, ipcMain } from 'electron'
import { GDTabPageContainer } from '../pages'

export class DesktopService {
  private static instance: DesktopService

  static get shared(): DesktopService {
    if (!DesktopService.instance) {
      DesktopService.instance = new DesktopService()
    }
    return DesktopService.instance
  }

  public init() {
    // 注册 IPC 处理函数
    ipcMain.handle('desktop:service', async (event: IpcMainInvokeEvent, params?: { type: string, data: any }) => {
      const type = params['type']
      const data = params['data']
      const func = functionMap[type]
      if (!func) {
        throw new Error(type + ' 方法未实现')
      }
      return func(event, data)
    })
  }
}

const closeTabOnTabPage = async (_event: IpcMainInvokeEvent, { id = -1 }) => {
  GDTabPageContainer.shared.closeTab(id)
  return {}
}

const frameDidReadyOnTabPage = async (_event: IpcMainInvokeEvent) => {
  GDTabPageContainer.shared.setFrameReady()
  return {}
}

const switchTabOnWindow = (_: IpcMainEvent, { id = -1 }) => {
  GDTabPageContainer.shared.switchTabWithId(id, false)
}

const createTabOnWindow = (_: IpcMainEvent, { url = '' }) => {
  GDTabPageContainer.shared.createTab(url)
}

const functionMap: any = {
  closeTabOnTabPage,
  frameDidReadyOnTabPage,
  switchTabOnWindow,
  createTabOnWindow,
}
