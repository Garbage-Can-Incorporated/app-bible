const {join} = require('path');
const {mkdir} = require('fs');

const {app} = require('electron');

const {
  Database,
  OPEN_READWRITE, OPEN_READONLY, OPEN_CREATE,
} = require('sqlite3');

const userDataPath = app.getPath('userData');

/**
* Sql DBService
*/
class DBService {
  /**
  * @class DBService
  * @param {String} title
  * @param {String} mode
  */
  constructor(title, mode = 'rw') {
    this.dbName = title;
    this.userDataPath = userDataPath;
    this.setMode(mode);
    this.db = null;
    return this;
  }

  /**
  * @method createTable
  * @param {String} tb
  * @param {Function} cb
  * @return {Object} db
  */
  createTable(tb, cb = null) {
    console.log({db: this.db});

    this.db.run(
        tb,
      cb !== null ? cb :
      (err) => {
        if (err) {
          console.log(`[DBS Error] could not create table`);
          return;
        }

        console.log(`[DBS Success] created successfully`);
      });

    return this;
  }

  /**
   * @method queryGet
   * @param {String} query
   * @param {Object} param
   * @param {Function} cb
   * @return {Object} this
   */
  queryGet(query, param, cb) {
    this.db.get(query, param, cb);
    return this;
  }

  /**
   * @method queryAll
   * @param {String} query
   * @param {Object} param
   * @param {Function} cb
   * @return {Object} this
   */
  queryAll(query, param, cb = null) {
    this.db.all(query, param, cb);
    return this;
  }

  /**
   * @method queryEach
   * @param {String} query
   * @param {Object} param
   * @param {Function} cb
   * @param {Function} complete
   * @return {Object} this
   */
  queryEach(query, param, cb, complete = null) {
    this.db.each(
        query, param, cb,
      complete === null ?
        () => console.log(`[DB-Service] operation completed!`) :
        complete
    );
    return this;
  }

  /**
  * @member
  * @method initconsole
  * @param {Function} cb
  * @return {Object} db
  */
  init() {
    const path = join(userDataPath, this.dbName);
    mkdir(path, {recursive: true}, (err) => {
      if (err) {
        console.log(`[MKDIR Error]`, {err});
      }
    });

    const db = new Database(
        `${path}/${this.dbName}.db`
    );

    this.db = db;
    return db;
  }

  /**
  * @member
  * @method close
  * @param {Function} cb
  */
  close(cb = null) {
    this.db.close()
        .on(
            'error', cb != null ? cb : () =>
              console.log(`[DBS Error] Database could not close successfully`)
        )
        .on(
            'close', cb != null ? cb : () =>
              console.log(`[DBS Sucess] Database closed successfully`)
        );
  }

  /**
  * @member
  * @method setMode
  * @param {String} mode
  */
  setMode(mode) {
    if (mode === 'rw') {
      this._mode = OPEN_READWRITE;
      return;
    }

    if (mode === 'r') {
      this._mode = OPEN_READONLY;
      return;
    }

    if (mode === 'c') {
      this._mode = OPEN_CREATE;
      return;
    }
  }
}

module.exports = DBService;
