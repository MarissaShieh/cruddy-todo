const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  counter.getNextUniqueId( (err, id ) => {
    fs.writeFile(path.join(exports.dataDir, `${id}.txt`), text, (err) => {
      if (err) {
        throw ('error creating new file');
      } else {
        callback(null, { id, text } ); //don't read file until file written
      }
    });
  });
};

exports.readAll = (callback) => {
  fs.readdir(exports.dataDir, (err, arrayOfFileNames) => {
    if (err) {
      throw ('error reading all files')
    } else {
      var data = _.map(arrayOfFileNames, (filenameTxt) => {
        var filePathArr = filenameTxt.split('.'); //eg ['00003',"txt"]
        var id = filePathArr[0]
        return { id, text: id };
      });
      callback(null, data);
    }
  });
};

exports.readOne = (id, callback) => {
  var text = items[id];
  if (!text) {
    callback(new Error(`No item with id: ${id}`));
  } else {
    callback(null, { id, text });
  }
};

exports.update = (id, text, callback) => {
  var item = items[id];
  if (!item) {
    callback(new Error(`No item with id: ${id}`));
  } else {
    items[id] = text;
    callback(null, { id, text });
  }
};

exports.delete = (id, callback) => {
  var item = items[id];
  delete items[id];
  if (!item) {
    // report an error if item not found
    callback(new Error(`No item with id: ${id}`));
  } else {
    callback();
  }
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
