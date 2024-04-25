import { BrowserWindow } from 'electron'
import { getPreloadPath, getSendEventJS, handleOpenWindow, startDevToolsIfNeed } from '../helpers/web'
import { GNBEventBus } from '../helpers/event-bus'
import { eventKey } from '../const'

export let mainWindow: BrowserWindow

export function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: getPreloadPath(),
    },
  })

  win.loadURL('http://localhost:9080')

  // 向渲染进程派发全局事件，处理页签显示逻辑
  GNBEventBus.shared.subscribe((data: any) => {
    win.webContents?.executeJavaScript(getSendEventJS(eventKey, data))
  })

  handleOpenWindow(win.webContents)

  startDevToolsIfNeed(win.webContents)

  mainWindow = win
}
