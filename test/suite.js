var ram = require('random-access-memory')
var core = require('hypercore')
var flumeTest = require('test-flumelog')
var Log = require('../')
var test = require('tape')

function createLog () {
  return Log(core(ram))
}

test('test-flumelog suite', function (t) {
  flumeTest(createLog, function (err) {
    t.ifError(err)
    t.end()
  })
})
