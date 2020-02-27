const {ipcMain} = require('electron');
const raidmaker = require('raidmaker');

const DBS = require('../db/db');

let event;
let db;

ipcMain.once('db-init', (e, dbName) => {
  event = e;
  db = new DBS(dbName, 'rw');

  const init = db.init();
  init
      .on('error', (err) => {
        console.log(`[Error] DB could not be opened successfully!`);

        // listen to this in renderer process
        event
            .sender
            .send('db-init-status', {status: false, error: err});
      });

  init
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

              console.log('[Success] ipcFav created table sucessfully');
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
                  console.log('[Error] favorite item insert error', {err});

                  e.sender
                      .send(
                          'is-fav-checked',
                          {
                            status: false,
                            message: 'an error occured',
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
                            message: 'Success!',
                            row,
                          }
                      );

                  return;
                } else {
                  console.log(`[DB] is fav check returned empty`);
                }
              }
          );
        });
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

ipcMain.on('remove-fav-item', () => {
  console.log(`[IPC Main] remove-fav-item called successfully`);
});

const setupFavoritesListeners = () => {
  console.log('[IPC] favorite');
};

module.exports = setupFavoritesListeners;
