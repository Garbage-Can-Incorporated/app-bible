const {app} = require('electron');
const AutoLaunch = require('auto-launch');

const init = require('./handlers/alarm-handler');

const alarmAutoLaunch = new AutoLaunch({
  name: 'EvryWord',
  isHidden: true,
});

alarmAutoLaunch.isEnabled()
    .then((isEnabled) => {
      if (isEnabled) {
        return;
      }

      alarmAutoLaunch.enable();
    })
    .catch((error) => console.log({error}));

app.on('ready', () => {
  // require alarm standby module
  init();
});
