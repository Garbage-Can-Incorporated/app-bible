const {ipcMain} = require('electron');
const fs = require('fs');
const path = require('path');

const versionsMap = {};

ipcMain.on('fetch-resource', (e, data) => {
    if (versionsMap[data.name] === undefined) {
        const resource = fs.readFileSync(
            path.join(__dirname, '../', 'resource', `bible-${data.name}.json`),
            {encoding: 'utf-8'}
        );
    
        versionsMap[data.name] = JSON.parse(resource).request;
    }

    return e.sender.send('fetch-resource-complete', {resource: versionsMap[data.name]});
});

const setupFavoritesListeners = () => {
    console.log('[IPC] favorite');
};
  
module.exports = setupFavoritesListeners;