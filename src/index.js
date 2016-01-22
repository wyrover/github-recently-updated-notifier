var schedule = require('node-schedule');
var request = require('request');
var jsdom = require('jsdom');
var fs = require('fs');
var HashMap = require('hashmap');
var md5 = require('md5');
var notifier = require('node-notifier');
var jquery = fs.readFileSync("jquery.min.js", "utf-8");

var map = new HashMap();
var map2 = new HashMap();
var map3 = new HashMap();

/*
request('https://github.com/search?o=desc&p=1&q=vue&s=updated&type=Repositories&utf8=%E2%9C%93', function(error, response, body) {
    if (!error && response.statusCode == 200) {
        console.log(body);
        fs.writeFile('test.html', body, 'utf8');
    }
});

*/


　　
//process.exit();

var j = schedule.scheduleJob('*/1 * * * *', function() {

    jsdom.env({
        url: "https://github.com/search?o=desc&p=1&q=vue&s=updated&type=Repositories&utf8=%E2%9C%93",
        src: [jquery],
        done: function(err, window) {
            var $ = window.$;

            $("li.repo-list-item").each(function() {
                var name = $(this).find("h3.repo-list-name").text();
                var time = $(this).find("time").attr('datetime');
                var key = md5(name + time);
                map3.set(key, name);
                if (!map.has(key)) {
                    map2.set(key, name);
                }
            });

            map = map3;

            if (map2.count() > 0) {
                console.log('--------------------------------');
                map2.forEach(function(value, key) {
                    console.log(key + " : " + value);
                });


                notifier.notify({
                    title: 'github',
                    message: '有新的项目更新了!',
                    sound: true
                });
            }




            map2.clear();
            map3.clear();

        }
    });

});