const { contextBridge, ipcRenderer } = require('electron')

// 将 ipcRenderer 对象暴露给渲染进程的全局环境中，以便在渲染进程中直接访问。
// 即，在渲染进程中可使用 window.$gnb.$desktop 函数与主进程通信
contextBridge.exposeInMainWorld('$gnb', {
  $desktop: ({ type, data }) => ipcRenderer.invoke('desktop:service', { type, data }),
})
