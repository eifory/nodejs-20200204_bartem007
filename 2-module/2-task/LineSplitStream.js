const stream = require('stream');
const os = require('os');

class LineSplitStream extends stream.Transform {
  constructor(options) {
    super(options);
    this.data = '';
  }

  _transform(chunk, encoding, callback) {
    let dataArr = [];
    this.data += chunk.toString();
    if (this.data.includes(os.EOL)) {
      dataArr = this.data.split(os.EOL);
      this.data = dataArr.pop();
      dataArr.forEach((item) => this.push(item));
    }
    callback(null);
  }
  _flush(callback) {
    callback(null, this.data);
  }
}

module.exports = LineSplitStream;
