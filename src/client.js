// var http = require('http');
var fetch = require('fetch');

var options = {
    host: 'httpbin.org',
    path: '/post',
    method: 'POST',
    headers: {},
};

var token = 'SCU11550Tab96f665e3a0376a2aa2da302e9147e359b3b0f75234a';

// function postState(state) {
//     options.headers['Content-Length'] = state.length;
//     var req = http.request(options, function(res) {
//         res.on('data', function(chunk) {
//             console.log('BODY: ' + chunk);
//         });
//     });

//     req.write(state);
//     req.end();
// }

function pushWechat(text, desp) {
    // encodeURIComponent 会 encode 所有字符这里只需要encoed中文
    var endPoint = 'http://sc.ftqq.com/' + token + '.send?text=' + encodeURI(text)+ '&desp=' + encodeURI(desp);

    return fetch(endPoint, {method: 'GET'})
        .then(function(response) {
            if (response && response.errmsg === 'success') {
                console.log(endPoint, 'sent', 'successfully');
            } else {
                console.error(endPoint, 'sent', 'failed');
            }
        })
        .catch(function(error) {
            console.error(error, 'caught when send ', endPoint, 'failed');
        });
}

module.exports = {
    options: options,
    pushWechat: pushWechat,
};
