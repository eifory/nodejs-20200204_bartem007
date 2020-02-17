const stream = require('stream');
const LimitExceededError = require('./LimitExceededError');

class LimitSizeStream extends stream.Transform {
  constructor(options) {
    super(options);
    this._chunkSum = 0;
    this._limit = options.limit;
  }

  _transform(chunk, encoding, callback) {
    this._chunkSum += chunk.length;
    if (this._chunkSum > this._limit) {
      callback(new LimitExceededError);
      return;
    }
    callback(null, chunk);
  }
};

module.exports = LimitSizeStream;
