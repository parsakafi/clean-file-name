const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')
let mainWindow = null

app.disableHardwareAcceleration()
// app.commandLine.appendSwitch('force_high_performance_gpu')
app.commandLine.appendSwitch('--log-level=0');
app.commandLine.appendSwitch('ignore-certificate-errors');

const gotTheLock = app.requestSingleInstanceLock()

if (!gotTheLock) {
    app.quit()
} else {
    app.on('second-instance', (event, commandLine, workingDirectory) => {
        if (mainWindow) {
            if (mainWindow.isMinimized()) mainWindow.restore()
            mainWindow.focus()
        }
    })
}

function createWindow() {
    const win = new BrowserWindow({
        width: 340,
        height: 80,
        frame: false,
        skipTaskbar: true,
        opacity: 0.95,
        setMenu: null,
        resizable: false,
        alwaysOnTop: true,
        minimizable: false,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: false,
            nodeIntegration: true,
            autoHideMenuBar: true,
            allowDisplayingInsecureContent: true,
            allowRunningInsecureContent: true
        }
    });

    win.setIcon(`${__dirname}${path.sep}assets${path.sep}app.ico`);

    win.loadFile('index.html');
}

ipcMain.on('dropped-file', (event, arg) => {
    console.log('Dropped File(s):', arg);
    event.returnValue = `Received ${arg.length} paths.`; // Synchronous reply
})

ipcMain.on('resize-window', (event, width, height) => {
    let browserWindow = BrowserWindow.fromWebContents(event.sender);
    browserWindow.setResizable(true);
    browserWindow.setSize(width, height);
    browserWindow.setResizable(false);
})

ipcMain.on('close-me', (evt, arg) => {
    app.quit()
});

app.whenReady().then(() => {
    createWindow()

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow()
        }
    })
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin')
        app.quit()
})
