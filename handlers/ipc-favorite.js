const {ipcMain} = require('electron');
const raidmaker = require('raidmaker');

const DBS = require('../db/db');

let dbInit = false;
let tableInit = false;

// const event = e;
const db = new DBS('favorites', 'rw');

const init = db.init();
init
    .on('error', (err) => {
      console.log(`[Error] DB could not be opened successfully!`);

      dbInit = false;
    });

init
    .on('open', () => {
      // listen to this in renderer process
      console.log(`[Success] DB opened`);
      dbInit = true;

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

              tableInit = false;
              return;
            }

            console.log('[Success] ipcFav created table sucessfully');
            tableInit = true;
          });
    });

ipcMain.on('add-fav-item', (e, data) => {
  console.log(`[IPC Main] add-fav-item called successfully`);

  db.queryRun(
      `
    INSERT INTO favorites (id, book, chapter, verse)
    VALUES ($id, $book, $chapter, $verse)
    `,
      {
        $id: raidmaker.generate(8, {mode: 'apnr'}),
        $book: data.scripture.book,
        $chapter: data.scripture.chapter,
        $verse: data.scripture.verse,
      },
      (err) => {
        if (err) {
          console.log('[Error] favorite item insert error', {err});

          e.sender
              .send(
                  'fav-item-addition-status',
                  {
                    status: false,
                    message: 'verse could not be added!',
                    error: err,
                  }
              );

          return;
        }

        e.sender
            .send(
                'fav-item-addition-status',
                {
                  status: true,
                  message: 'added to favourites!',
                  error: null,
                }
            );
      }
  );
});


ipcMain.on('is-fav-check', (e, data) => {
  console.log(`[IPC Main] is-fav-check called successfully`);
  console.log({data});

  db.queryGet(
      `
        SELECT * FROM favorites
        WHERE book = $book AND chapter = $chapter AND verse = $verse
      `,
      {
        $book: data.book,
        $chapter: data.chapter,
        $verse: data.verse,
      },
      (err, row) => {
        if (err) {
          console.log('[Error] favorite item check error', {err});

          e.sender
              .send(
                  'is-fav-checked',
                  {
                    status: false,
                    message: 'an error occured!',
                    error: err,
                  }
              );

          return;
        }

        console.log({err, row});

        if (row) {
          e.sender
              .send(
                  'is-fav-checked',
                  {
                    status: true,
                    message: 'Success! item is a favorite',
                    row,
                  }
              );

          return;
        } else {
          console.log(`[DB] is fav check returned empty`);
          e.sender
              .send(
                  'is-fav-checked',
                  {
                    status: false,
                    message: 'Item is not added as a favorite',
                  }
              );
        }
      }
  );
});

ipcMain.on('remove-fav-item', (e, data) => {
  console.log(`[IPC Main] remove-fav-item called successfully`);
  db.queryGet(
      `
    DELETE FROM favorites
    WHERE book = $book AND chapter = $chapter AND verse = $verse
    `,
      {
        $book: data.scripture.book,
        $chapter: data.scripture.chapter,
        $verse: data.scripture.verse,
      },
      (err, row) => {
        if (err) {
          console.log('[Error] an error occured deleting favorite item', {err});

          e.sender
              .send(
                  'fav-item-removal-status',
                  {
                    status: false,
                    message: 'an error occured!',
                    error: err,
                  }
              );

          return;
        }

        console.log({err, row});
        if (row) {
          e.sender
              .send(
                  'fav-item-removal-status',
                  {
                    status: true,
                    message: 'Success! Removed from favorites',
                    row,
                  }
              );

          return;
        }

        e.sender
            .send(
                'fav-item-removal-status',
                {
                  status: false,
                  message: 'operation returned empty',
                }
            );
      }
  );
});

ipcMain.on('list-fav-items', () => {
  console.log(`[IPC Main] list-fav-items called successfully`);
  db.queryAll(
      `SELECT * FROM favorites`,
      (error, data) => {
        console.log({error, data});
      }
  );
});

ipcMain.on(
    'is-favorites-created', (e) =>
      e.sender.send('favorites-db-table-created', {dbInit, tableInit})
);

const setupFavoritesListeners = () => {
  console.log('[IPC] favorite');
};

module.exports = setupFavoritesListeners;
