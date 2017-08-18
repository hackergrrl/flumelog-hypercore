var pullify = require('stream-to-pull-stream')
var Obv = require('obv')

module.exports = Log

function Log (feed) {
  if (!(this instanceof Log)) return new Log(feed)

  this.feed = feed

  this.since = Obv()

  var self = this
  this.feed.head(function (err, data) {
    if (err) self.since.set(-1)
    else self.since.set(data)
  })
}

Log.prototype.dir = null

Log.prototype.get = function (n, cb) {
  this.feed.get(n, cb)
}

Log.prototype.stream = function (opts) {
  return pullify(this.feed.createReadStream(opts))
}

Log.prototype.append = function (data, cb) {
  if (Array.isArray(data)) {
    var elm = data.shift()
    var self = this
    this.feed.append(elm, function (err) {
      if (err) return cb(err)

      if (data.length) return self.append(data, cb)
      else {
        self.since.set(self.feed.length)
        return cb(null, self.feed.length)
      }
    })
  } else {
    this.feed.append(data, cb)
  }
}
