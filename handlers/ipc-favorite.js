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

        db.createTable(
            `
            CREATE TABLE IF NOT EXISTS favorites (
              id VARCHAR PRIMARY KEY UNIQUE NOT NULL,
              book VARCHAR NOT NULL,
              chapter INTEGER NOT NULL,
              verse INTEGER NOT NULL
            )
            `,
            (err) => {
              if (err) {
                console.log(
                    '[Error] ipcFav could not create table', {error: err}
                );

                event
                    .sender
                    .send(
                        'db-table-creation-status',
                        {status: false, error: err}
                    );

                return;
              }

              console.log('[Error] ipcFav created table sucessfully');
              event
                  .sender
                  .send(
                      'db-table-creation-status',
                      {status: true, error: null}
                  );
            });

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
