// ref: https://gist.github.com/jfairbank/9bb7da0e60eeac5b55fa
/* global Promise */
require('promise');

function poll(fn, timeout, interval) {
    // default timeout = 2s, interval = 100ms
    var endTime = Number(new Date()) + (timeout || 2000);
    interval = interval || 100;

    return new Promise(function(resolve, reject) {
        (function p() {
            // If the condition is met, we're done!
            var result = fn();
            if (result) {
                resolve(result);
            } else if (Number(new Date()) < endTime) {
                // If the condition isn't met but the timeout hasn't elapsed, go again
                setTimeout(p, interval);
            } else {
                // Didn't match and too much time, reject!
                reject('timed out for ' + fn + ': ' + arguments);
            }
        })();
    });
}

module.exports = exports = {
    poll: poll,
};
