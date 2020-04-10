const fs = require('fs');
const path = require('path');

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
  // location: 0,
  // distance: 100,
  maxPatternLength: 100,
  minMatchCharLength: 5,
  keys: ['verses'],
};
let resource;
let fuse;

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

          resource = data;
          cb(resource.request);
        });
  }
};

getResource((data) => {
  fuse = new Fuse(data, options);

  process.on('message', (_data) => {
    fuse.search(_data.query);

    fuse.subscribe(
        (data) => {
          process.send({result: data, status: true});
        },
        (error) => {
          console.log({error});
          process.send({result: null, status: false});
        }
    );
  });
});

