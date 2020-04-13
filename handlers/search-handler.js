const fs = require('fs');
const path = require('path');

const {observeOn, distinctUntilChanged} = require('rxjs/operators');
const {asyncScheduler} = require('rxjs');

const Fuse = require('fuse.js');

const options = {
  caseSensitive: false,
  shouldSort: true,
  tokenize: true,
  matchAllTokens: true,
  findAllMatches: true,
  includeScore: true,
  includeMatches: true,
  threshold: 0.0,
  maxPatternLength: 100,
  minMatchCharLength: 5,
  keys: ['verses'],
};
let resource;
let fuse;
let subscription;

const getResource = (cb) => {
  if (resource !== undefined) {
    cb(resource.request);
  } else {
    fs.readFile(
        path.join(path.dirname(__dirname), '/resource/bible-all.json'),
        {encoding: 'utf8'},
        (err, data) => {
          if (err) {
            console.log(`[Search] search service isn't available`, {err});
            return;
          }

          resource = JSON.parse(data);
          cb(resource.request);
        });
  }
};


const setup = Object.freeze({
  init: () => {
    getResource((data) => {
      fuse = new Fuse(data, options);
    });
  },
  search: (_data, cb) => {
    if (subscription !== undefined) {
      subscription.unsubscribe();
    }

    subscription = fuse
        .subject
        .pipe(
            observeOn(asyncScheduler),
            distinctUntilChanged()
        )
        .subscribe(
            (result) => {
              if (result) {
                process.send({result, status: true});
              } else {
                // nothing was found
                process.send({result: null, status: true});
              }
            },
            (error) => {
              console.log({error});
              process.send({result: null, status: false});
            },
            () => {
              console.log('complete indeed!');
              // fuse.subject.unsubscribe();
            }
        );

    fuse.search(_data.query);
  },
  cbSearch: (_data, cb) => {
    /* if (subscription !== undefined) {
      subscription.unsubscribe();
    } */

    /* subscription =  */fuse
        .subject
        .pipe(
            // observeOn(asyncScheduler),
            // distinctUntilChanged()
        )
        .subscribe(
            (result) => {
              if (result) {
                // process.send({result, status: true});
                cb({result, status: true});
              } else {
                // nothing was found
                // process.send({result: null, status: true});
                cb({result, status: true});
              }
            },
            (error) => {
              console.log({error});
              // process.send({result: null, status: false});
              cb({result: null, status: false});
            },
            () => {
              console.log('complete indeed!');
              fuse.subject.unsubscribe();
            }
        );

    fuse.search(_data.query);
  },
});

process.on('message', (_data) => {
  if (_data.purpose === 'init') {
    setup.init();
    return;
  }

  if (_data.purpose === 'search') {
    setup.search(_data);
  }
});

module.exports = setup;
