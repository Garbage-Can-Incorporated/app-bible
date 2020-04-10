const {ipcMain} = require('electron');
const childProcess = require('child_process');

const sp = childProcess.fork('./handlers/search-handler.js');

ipcMain.on('search', (e, data) => {
  // speak to forked process;
  sp.send(data);

  // receive response
  sp.on('message', (data) => {
    // asyc results from fuse-subject, would send a few times
    // console.log({searchResult: data});
    if (data.status) {
      e.sender.send('search-result', data.result);
    }
  });
});


const init = () => {
  console.log('[Search] init');
};

module.exports = init;
