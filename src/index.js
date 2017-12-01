/* global $, Promise */
'use strict';
require('promise');

var restClient = require('./client');
var menuKit = require('./menu');

var currentTemperature = null;
var currentHumidity = null;
var currentUser = 0;

function updateLcd() {
    return new Promise(function(resolve) {
        resolve(
            menuKit.show([
                {
                    text: 'User ' + currentUser,
                    value: currentUser,
                    items: [],
                },
            ])
        );
    });
}

$.ready(function(error) {
    if (error) {
        console.error(error);
        return;
    }

    // devices
    var lcd = $('#lcd1602-02');
    var button = $('#button');
    var ledGreen = $('#led-g');
    var watcher1 = $('#watcher-one');
    var watcher2 = $('#watcher-two');

    button.on('push', function() {
        ledGreen.turnOn(function() {
            restClient.pushWechat('实时数据', '当前人数是' + currentUser + '人\n');
        });
    });

    button.on('release', function() {
        console.log('Button released.');
        ledGreen.turnOff(function() {});
    });

    var near1,
        away1,
        near2,
        away2 = null;
    // one
    watcher1.on('near', function() {
        near1 = +new Date();
    });

    watcher1.on('away', function() {
        away1 = +new Date();
    });

    watcher2.on('near', function() {
        near2 = +new Date();
    });

    watcher2.on('away', function() {
        away2 = +new Date();
    });

    menuKit.init(lcd, button);

    setInterval(function() {
        updateLcd().catch(function(reason) {
            console.error(reason);
        });
    }, 1100);

    setInterval(function() {
        if (near1 && near2 && away1 && away2) {
            if (away2 > away1) {
                currentUser += 1;
            } else {
                currentUser -= 1;
            }
            // if (currentUser < 0) {
            //     currentUser = 0;
            // }
        }
        // reset watchers
        near1 = null;
        away1 = null;
        near2 = null;
        away2 = null;
    }, 500);
});

$.end(function() {
    $('#led-g').turnOff();
    // $('#lcd1602-02').hide();
});
