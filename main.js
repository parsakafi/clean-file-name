const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')

app.disableHardwareAcceleration()
// app.commandLine.appendSwitch('force_high_performance_gpu')
app.commandLine.appendSwitch('--log-level=0');
app.commandLine.appendSwitch('ignore-certificate-errors');

function createWindow() {
    const win = new BrowserWindow({
        width: 340,
        height: 130,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: false,
            nodeIntegration: true,
            autoHideMenuBar: true,
            allowDisplayingInsecureContent: true,
            allowRunningInsecureContent: true,
            alwaysOnTop: true
        }
    });

    win.setIcon(`${__dirname}${path.sep}assets${path.sep}app.ico`);

    win.setResizable(false);
    win.setMenu(null);
    win.setOpacity(0.95);
    win.setAlwaysOnTop(true, "normal");
    win.loadFile('index.html');
}

ipcMain.on('dropped-file', (event, arg) => {
    console.log('Dropped File(s):', arg);
    event.returnValue = `Received ${arg.length} paths.`; // Synchronous reply
})

ipcMain.on('resize-window', (event, width, height) => {
    let browserWindow = BrowserWindow.fromWebContents(event.sender)
    browserWindow.setSize(width, height)
})

app.whenReady().then(() => {
    createWindow()

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow()
        }
    })
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})
