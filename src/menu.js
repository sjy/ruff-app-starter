// https://rap.ruff.io/raps/menu
var Menu = require('menu');

var _lcd = null;
var _nextBtn = null;
var _selectBtn = null;

function init(lcd, nextBtn, selectBtn) {
    _lcd = lcd;
    _nextBtn = nextBtn;
    _selectBtn = selectBtn;
}

function show(options) {
    if (_lcd === null) {
        console.log('-------------------------------');
        console.log('| menu kit has not initialized |');
        console.log('-------------------------------');
    }

    _lcd.hideCursor();

    var menu = new Menu(_lcd, options);

    if (_nextBtn) {
        _nextBtn.on('push', function() {
            menu.next();
        });
    }

    if (_selectBtn) {
        _selectBtn.on('push', function() {
            menu.select();
        });
    }

    menu.show().then(function(result) {
        _lcd.print('result:', result || '(empty)');
    });
}

module.exports = {
    show: show,
    init: init,
};
