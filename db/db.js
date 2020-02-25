const {Database, OPEN_READWRITE, OPEN_READ, OPEN_WRITE} = require('sqlite3');

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
  * @method init
  * @param {Function} cb
  * @return {Object} db
  */
  init(cb = null) {
    this.db = new Database(
        this.path,
        this.mode,
      cb !== null ? cb : () => {
        console.log({init: '[DB-Service] initialization successful'});
      }
    );
    return this.db;
  }

  /**
  * @member
  * @method close
  */
  close() {
    this.db.close();
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

    if (mode === 'r') {
      this._mode = OPEN_WRITE;
      return;
    }
  }
}

module.exports = DBService;
