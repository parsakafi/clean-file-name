const { ipcRenderer, remote } = require('electron');

let minimize = false;

document.querySelector('#toggle-window').addEventListener('click', () => {
    minimize = !minimize;
    document.querySelector('body').classList.toggle('minimize');

    if (minimize)
        ipcRenderer.send('resize-window', 70, 70);
    else
        ipcRenderer.send('resize-window', 340, 80);
});

document.getElementById("close-window").addEventListener("click", function (e) {
    ipcRenderer.send('close-me');
});
