const {app, BrowserWindow} = require('electron');
const path = require('path');


let win;

function createWindow(){
    win= new BrowserWindow({
        width: 800, height: 600,
        transparent: true,
        frame: false,
        webPreferences: {
            nodeIntegration: true
        },
        //titleBarStyle: 'hidden'
        titleBarStyle: 'customButtonsOnHover'
    });

    win.loadURL('http://localhost:3000');

   // win.webContents.toggleDevTools();
    
    win.on('closed', ()=>{
       win = null; 
    });
}

app.on('ready', createWindow);

app.on('window-all-closed', ()=>{
    if(process.platform !== 'darwin'){
        app.quit();
    }
});


app.on('activate', ()=>{
    if(win === null){
        createWindow();
    }
});