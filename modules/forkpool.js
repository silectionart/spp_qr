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


// class Pool {
//     constructor(path, args, options, settings) {

//         this.path = path;
//         this.args = args;
//         this.options = options;

//         this.name = settings.name || 'fork-pool';
//         this.size = settings.size || require('os').cpus().length;
//         this.log = settings.log || false;
//         this.timeout = settings.timeout || 30000;
//         this.debug = settings.debug || false;
//         this.debugPort = settings.debugPort || process.debugPort;
//         this.pool;
//         this.init = this.init.bind(this);
//         this.enque = this.enque.bind(this);
//     }


//     init = () => {
//         this.pool = generic.createPool({
//             create: function (callback) {
//                 var debugArgIdx = process.execArgv.indexOf('--debug');
//                 if (debugArgIdx !== -1) {
//                     // Remove debugging from process before forking
//                     process.execArgv.splice(debugArgIdx, 1);
//                 }
//                 if (this.debug) {
//                     // Optionally set an unused port number if you want to debug the children.
//                     // This only works if idle processes stay alive (long timeout), or you will run out of ports eventually.
//                     process.execArgv.push('--debug=' + (++this.debugPort));
//                 }
//                 var childNode = childProcess.fork(this.path, this.args, this.options);
//                 callback(null, childNode);
//             },
//             destroy: function (client) {
//                 client.kill();
//             },
//         }, {
//             // settings: settings,
//             name: this.name,
//             max: this.size,
//             min: this.size - 1,
//             idleTimeoutMillis: this.timeout,
//             log: this.log
//         });
//     };

//     enque(data, callback) {
//         var instance = this.pool;
//         instance.acquire(function (err, client) {
//             if (err) {
//                 callback(err);
//             } else {
//                 client.send(data);
//                 client.once('message', function (message) {
//                     var a = {
//                         pid: client.pid,
//                         stdout: message
//                     };

//                     instance.release(client);
//                     callback(null, a);
//                 });
//             }
//         });
//     };

//     drain(callback) {
//         var instance = this.pool;
//         instance.drain(function () {
//             instance.destroyAllNow();
//             callback(null);
//         });
//     };

//     poolInstance() {
//         return this.pool;
//     }

//     available() {
//         var instance = this.pool;
//         return instance.available;
//     }

// }


class Pool {
    constructor(path) {
        const factory = {
            create: function () {
                return childProcess.fork(path);
            },
            destroy: function (client) {
                client.kill();
            }
        }
        const size = require('os').cpus().length;
        const opts = {
            max: size,
            min: size - 1,
            name: "fork-pool",
            idleTimeoutMillis: 30000
        }
        this.pool = generic.createPool(factory, opts);
        // this.enque = enque;
    }

    enqueue(data, callback) {
        let instance = this.pool;
        instance.acquire().then(client => {
            client.send(data);
            client.once('message', message => {
                let a = {
                    pid: client.pid,
                    stdout: message
                };
                instance.release(client);
                callback(null, a);

            })
        }).catch(err => {
            callback(err);
        })
    };

    get available() {
        return this.pool.available;
    };

    drain() {
        let instance = this.pool;
        instance.drain().then(() => {
            return instance.clear();
        }).then(() => {
            console.log("Drained queue");
        })
    };
}
module.exports = Pool;