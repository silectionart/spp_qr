/**
 * A generic child process "fork" pool for node.
 *
 * @package fork-pool
 * @author Andrew Sliwinski <andrewsliwinski@acm.org>
 */

/**
 * Dependencies
 */
var childProcess = require('child_process');
var generic = require('generic-pool');

/**
 * Constructor
 */
class Pool {
  constructor(path, args, options, settings) {

    this.name = settings.name || 'fork-pool';
    this.size = settings.size || require('os').cpus().length;
    this.log = settings.log || false;
    this.timeout = settings.timeout || 30000;
    this.debug = settings.debug || false;
    this.debugPort = settings.debugPort || process.debugPort;
    this.pool;
    this.init();
  }

  init() {
    this.pool = generic.Pool({
      settings: settings,
      name: settings.name,
      create: function (callback) {
        var debugArgIdx = process.execArgv.indexOf('--debug');
        if (debugArgIdx !== -1) {
          // Remove debugging from process before forking
          process.execArgv.splice(debugArgIdx, 1);
        }
        if (this.settings.debug) {
          // Optionally set an unused port number if you want to debug the children.
          // This only works if idle processes stay alive (long timeout), or you will run out of ports eventually.
          process.execArgv.push('--debug=' + (++this.settings.debugPort));
        }
        var childNode = childProcess.fork(path, args, options);
        callback(null, childNode);
      },
      destroy: function (client) {
        client.kill();
      },
      max: settings.size,
      min: settings.size - 1,
      idleTimeoutMillis: settings.timeout,
      log: settings.log
    });
  }


  enque(data, callback) {
    var instance = this.pool;
    instance.acquire(function (err, client) {
      if (err) {
        callback(err);
      } else {
        client.send(data);
        client.once('message', function (message) {
          var a = {
            pid: client.pid,
            stdout: message
          };

          instance.release(client);
          callback(null, a);
        });
      }
    });
  };

  drain(callback) {
    var instance = this.pool;
    instance.drain(function () {
      instance.destroyAllNow();
      callback(null);
    });
  };

  poolInstance() {
    return this.pool;
  }

  available() {
    var instance = this.pool;
    return instance.available;
  }

}
module.exports = Pool;