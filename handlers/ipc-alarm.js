const {mkdir} = require('fs');
const {join} = require('path');

const {ipcMain, app} = require('electron');
const raidmaker = require('raidmaker');

const Store = require('electron-store');
const schema = require('../schemas/alarm.json');

const userDataPath = app.getPath('userData');
const alarmsPath = join(userDataPath, 'alarms');
let addAlarmEvent;

mkdir(alarmsPath, {recursive: true}, (err) => {
  if (err) {
    console.log(`[MKDIR Error]`, {err});
  }
});

const cwd = alarmsPath;
const alarmStore = new Store({
  schema,
  name: 'alarms',
  cwd,
});

alarmStore.onDidChange('alarms', (data, _) => {
  if (addAlarmEvent !== undefined && addAlarmEvent !== null) {
    addAlarmEvent.sender.send('all-alarms', data);
  } else {
    console.log(`[Error] add alarm event is undefined or null`);
  }
});

ipcMain.on('add-alarm', (e, data) => {
  addAlarmEvent = e;

  data.id = raidmaker.generate(8, {mode: 'apnr'});
  let alarms = alarmStore.get('alarms');

  if (alarms === undefined || alarms === null) {
    alarms = [];
    alarms.push(data);
  } else {
    alarms.push(data);
  }

  alarmStore.set('alarms', alarms);

  addAlarmEvent.sender.send('add-alarm-success', alarms);
});

ipcMain.on('get-all-alarms', (e, data) => {
  const alarms = alarmStore.get('alarms');

  e.sender.send('all-alarms', alarms);
});

ipcMain.on('edit-alarm-prop', (e, data) => {
  const prop = Object.getOwnPropertyNames(data)
      .find((cur) => (cur !== 'i') ? cur : null);

  const alarms = alarmStore.get('alarms');
  alarms[data.i][prop] = data[prop];
  alarmStore.set(`alarms`, alarms);

  e.sender
      .send('edit-alarm-prop-success', {message: 'Success!'});
});

const setupAlarmListeners = () => {
  console.log('[Alarm] listener started');
};

module.exports = setupAlarmListeners;
