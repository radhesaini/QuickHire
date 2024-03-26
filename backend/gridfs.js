const mongoose = require('mongoose');
const Grid = require('gridfs-stream');
Grid.mongo = mongoose.mongo;

let gfs;
mongoose.connection.once('open', () => {
  gfs = Grid(mongoose.connection.db);
});

module.exports = gfs;