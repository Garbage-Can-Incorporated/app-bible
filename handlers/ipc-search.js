const {ipcMain} = require('electron');
const childProcess = require('child_process');

const sp = childProcess.fork('./handlers/search-handler.js');
sp.send(Object.assign({}, {purpose: 'init'}));

// const setup = require('./search-handler');
// setup.init();

ipcMain.on('search', (e, data) => {
  let times = 0;
  let searchResultIndices = [];
  // speak to forked process;
  sp.send(Object.assign({}, {purpose: 'search'}, data));

  // receive response
  sp.on('message', (data) => {
    // async results from fuse-subject, would send a few times

    if (data.status) { // no error
      console.log('beginning', {searchResultIndices});

      if (
        searchResultIndices
            // eslint-disable-next-line max-len
            .includes(`${data.result.item.bookTitle}-${data.result.item.chapterNo}-${data.result.matches[0].arrayIndex}`) === true
      ) {
        console.log('true', {searchResultIndices, sp});
        return;
      }

      searchResultIndices.push(
          // eslint-disable-next-line max-len
          `${data.result.item.bookTitle}-${data.result.item.chapterNo}-${data.result.matches[0].arrayIndex}`
      );

      e.sender.send('search-result', data.result);
      console.log('false', {searchResultIndices});

      times++;
      console.log({times, result: data.result});
    }
  });

  /* setup.cbSearch(
      Object.assign({}, {purpose: 'search'}, data),
      (res) => {
        if (res.status) {
          e.sender.send('search-result', res.result);

          times++;
          console.log({times, result: res.result.item.chapterNo});
        }
      }); */

  searchResultIndices = [];
  times = 0;
});


const init = () => {
  console.log('[Search] init');
};

module.exports = init;
