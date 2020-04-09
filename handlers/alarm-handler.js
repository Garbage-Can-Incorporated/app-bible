const EventEmitter = require('events');
const {app, Notification} = require('electron');
const path = require('path');

const Store = require('electron-store');

// rewrote user path to EvryWord's path
const userDataPath = path.dirname(app.getPath('userData'));
const alarmsPath = path.join(userDataPath, 'EvryWord', 'alarms');
const cwd = alarmsPath;

let alarms;
let filteredAlarms;

const alarmStore = new Store({
  name: 'alarms',
  cwd,
});

// all alarms from alarmStore
alarms = alarmStore.get('alarms');

const getAlarmEmitter = new EventEmitter();

const getAlarm = () => {
  alarms = alarmStore.get('alarms');

  // alarms for the day
  filteredAlarms = alarms
      .map((cur) => {
        if (
          cur.days.includes(new Date().getDay()) ||
          cur.days.length === 0
        ) {
          // set cur.rang = true to cur.rang = false at 00:00
          if (
            (new Date().getHours() === 0 && /* midnight 00:00 */
              new Date().getMinutes() === 0) ||
              (new Date().getHours() === 23 && /* 23:59 */
                new Date().getMinutes() >= 59) ||
              (new Date().getHours() === 0 && /* 00:02 */
                new Date().getMinutes() <= 02)
          ) {
            filteredAlarms.forEach((cur) => {
              if (cur.rang) {
                cur.rang = false;
              }
            });

            alarmStore.set('alarms', alarms);
          }

          return cur;
        }
      })
      .filter((cur) => cur !== undefined);
};

getAlarmEmitter.on('get-alarms', () => {
  getAlarm();
});

// set Icon path
let iconPath;

if (process.platform === 'win32') {
  iconPath = path
      .join(__dirname, '../../src/assets/ico/favicon32x32.ico');
}

if (process.platform === 'linux') {
  iconPath = path
      .join(__dirname, '../../src/assets/imgs/favicon48x48.png');
}

if (process.platform === 'darwin') {
  iconPath = path
      .join(__dirname, '../../src/assets/icns/favicon32x32.icns');
}

// the ringer
const alarmRinger = () => {
  setInterval(() => {
    filteredAlarms
        .forEach((cur) => {
          if (
            cur.time <= new Date().getTime() &&
            // 30000ms lapsed time, could increase it to 300,000ms === 5 minutes
            (new Date().getTime() - cur.time) <= 30000 &&
            cur.rang === false
          ) {
            cur.rang = true;
            const i = alarms.findIndex((_cur) => _cur.id === cur.id);
            alarms[i].rang = true;
            alarmStore.set('alarms', alarms);
            // set all back to false at midnight

            console.log({
              label: cur.label,
              time: new Date(cur.time).toString(),
            });

            if (Notification.isSupported()) {
              const notif = new Notification({
                title: 'EvryWord would like to get your attention',
                body: cur.label,
                silent: false,
                icon: iconPath,
              });

              notif.show();
            }
          }
        });
  }, 1000);
};

if (filteredAlarms) {
  alarmRinger();
}

// initialization
init = () => {
  console.log(`[Alarm] Standby service started`);

  setInterval((e) => {
    e.emit('get-alarms');
  }, 500, getAlarmEmitter);
};

module.exports = init;
