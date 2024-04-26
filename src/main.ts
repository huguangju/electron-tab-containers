import { app } from 'electron'
import { createWindow } from './window'
import { DesktopService } from './service'

app.whenReady().then(() => {
  // 处理来自渲染进程的通知
  DesktopService.shared.init()

  createWindow()
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
