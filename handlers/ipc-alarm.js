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
  data.rang = false;
  data.snooze = false;
  data.snoozeTime = 10000;

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

  if (prop === 'repeat') {
    if (data.repeat === false) {
      alarms[data.i]._days = alarms[data.i].days;
      alarms[data.i].days = [];
    } else {
      alarms[data.i].days = alarms[data.i]._days || [];
      alarms[data.i]._days = [];
    }
  }

  alarmStore.set(`alarms`, alarms);

  e.sender
      .send('edit-alarm-prop-success', {message: 'Success!'});
});

ipcMain.on('add-repeat-day', (e, data) => {
  const alarms = alarmStore.get('alarms');
  alarms[data.i].days.push(data.day);
  alarmStore.set(`alarms`, alarms);

  e.sender
      .send(
          'repeat-day-response',
          {message: 'Success!', op: 'add'}
      );
});

ipcMain.on('remove-repeat-day', (e, data) => {
  const alarms = alarmStore.get('alarms');
  const alarmItem = alarms[data.i];
  alarmItem.days = alarmItem.days
      .filter((cur) => cur !== data.day);
  alarmStore.set(`alarms`, alarms);

  e.sender
      .send(
          'repeat-day-response',
          {message: 'Success!', op: 'remove'}
      );
});

ipcMain.on('delete-alarm', (e, data) => {
  let alarms = alarmStore.get('alarms');

  alarms = alarms.filter((_, i) => i !== data.i);

  alarmStore.set('alarms', alarms);

  e.sender
      .send(
          'delete-alarm-success',
          {message: 'Success!'}
      );
});

const setupAlarmListeners = () => {
  console.log('[Alarm] listener started');
};

module.exports = setupAlarmListeners;
