const {ipcMain} = require('electron');

const DBS = require('../db/db');

let event;

ipcMain.once('db-init', (e, dbName) => {
  event = e;
  console.log({event, dbName});

  const db = new DBS(dbName, 'rw').init();
  db
      .on('error', (err) => {
        console.log(`[Error] DB could not be opened successfully!`);

        // listen to this in renderer process
        event
            .sender
            .send('db-init-status', {status: false, error: err});
      });

  db
      .on('open', () => {
      // listen to this in renderer process
        console.log(`[Success] DB opened`);
        console.log({event});

        event
            .sender
            .send('db-init-status', {status: true});
      });
});

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
