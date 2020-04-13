const {ipcMain} = require('electron');
const childProcess = require('child_process');

const sp = childProcess.fork('./handlers/search-handler.js');
sp.send(Object.assign({}, {purpose: 'init'}));

// const setup = require('./search-handler');
// setup.init();

ipcMain.on('search', (e, data) => {
  let times = 0;
  // speak to forked process;
  sp.send(Object.assign({}, {purpose: 'search'}, data));

  // receive response
  sp.on('message', (data) => {
    // async results from fuse-subject, would send a few times

    if (data.status) { // no error
      e.sender.send('search-result', data.result);

      times++;
      console.log({times, result: data.result.item.chapterNo});
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

  times = 0;
});


const init = () => {
  console.log('[Search] init');
};

module.exports = init;
