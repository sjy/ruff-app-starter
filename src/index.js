/* global $, Promise */
'use strict';
require('promise');

var restClient = require('./client');
var menuKit = require('./menu');

var currentTemperature = null;
var currentHumidity = null;
var currentUser = 0;

function updateLcd(dht) {
    return Promise.all([
        new Promise(function(resolve, reject) {
            // 温度
            dht.getTemperature(function(error, value) {
                if (error) reject(error);
                resolve(value);
            });
        }),
        new Promise(function(resolve, reject) {
            // 湿度
            dht.getRelativeHumidity(function(error, value) {
                if (error) reject(error);
                resolve(value);
            });
        }),
    ]).then(function(values) {
        currentTemperature = values[0];
        currentHumidity = values[1];
        menuKit.show([
            {
                text: 'User ' + currentUser,
                value: currentUser,
            },
            {
                text: 'Temperat ' + values[0] + 'C',
                value: values[0],
            },
            {
                text: 'Humidity ' + values[1] + '%',
                value: values[1],
            },
        ]);
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
    var dht = $('#dht11');
    var watcher1 = $('#watcher-one');
    var watcher2 = $('#watcher-two');

    button.on('push', function() {
        ledGreen.turnOn(function() {
            restClient.pushWechat(
                '实时数据',
                '当前房间温度是' +
                    currentTemperature +
                    '摄氏度,湿度是' +
                    currentHumidity +
                    '%\n'
            );
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
        updateLcd(dht).catch(function(reason) {
            console.error(reason);
        });
    }, 2000);

    setInterval(function() {
        if (near1 && near2 && away1 && away2) {
            if (away2 > away1) {
                currentUser += 1;
            } else {
                currentUser -= 1;
            }
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
