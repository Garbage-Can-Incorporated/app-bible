const {join} = require('path');
const {mkdir} = require('fs');

const {app} = require('electron');

const {Database, OPEN_READWRITE, OPEN_READ, OPEN_WRITE} = require('sqlite3');

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
    this.path = userDataPath;
    this.setMode(mode);
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
    mkdir(join(userDataPath, this.dbName), (err) => {
      if (err) {
        console.log(`[MKDIR Error]`, {err});
      }
    });

    const db = new Database(
        `${join(this.path, this.dbName)}/favourites.db`,
        this.mode
    );

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
            'error', cb != null ? cb(err) : () =>
              console.log(`[DBS Error] Database could not close successfully`)
        )
        .on(
            'close', cb != null ? cb() : () =>
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
      this._mode = OPEN_READ;
      return;
    }

    if (mode === 'w') {
      this._mode = OPEN_WRITE;
      return;
    }
  }
}

module.exports = DBService;
