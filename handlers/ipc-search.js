const {ipcMain} = require('electron');
const childProcess = require('child_process');

const sp = childProcess.fork('./handlers/search-handler.js');
sp.send(Object.assign({}, {purpose: 'init'}));

// const setup = require('./search-handler');
// setup.init();

ipcMain.on('search', (e, data) => {
  // speak to forked process;
  sp.send(Object.assign({}, {purpose: 'search'}, data));

  // receive response
  sp.on('message', (data) => {
    // async results from fuse-subject, would send a few times
    console.log(`[Ipc search]`, {result: data});

    if (data.status) {
      e.sender.send('search-result', data.result);
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
});


const init = () => {
  console.log('[Search] init');
};

module.exports = init;
