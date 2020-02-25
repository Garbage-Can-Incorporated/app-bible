const {ipcMain} = require('electron');

const DBS = require('../db/db');

const db = new DBS('favorites', 'rw');

let event;

ipcMain.on('db-init', (e) => {
  event = e;
});

const setupFavoritesListeners = (win) => {
  db.init()
      .on('error', () => {
        console.log(`[Error] DB could not be open successfully!`);

        // listen to this in renderer process
        event
            .sender
            .send('db-init-status', {status: false});
      })
      .on('open', () => {
        // listen to this in renderer process
        event
            .sender
            .send('db-init-status', {status: true});

        ipcMain.on('add-fav-item', () => {
          console.log(`[IPC Main] add-fav-item called successfully`);
        });

        ipcMain.on('remove-fav-item', () => {
          console.log(`[IPC Main] remove-fav-item called successfully`);
        });

        ipcMain.on('is-fav-check', () => {
          console.log(`[IPC Main] remove-fav-item called successfully`);
        });
      });
};

module.exports = setupFavoritesListeners;
