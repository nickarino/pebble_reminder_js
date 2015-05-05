(function () {
    'use strict';
    /*global console, require, showBodyMessage*/
    var UI = require('ui'),
        ajax = require('ajax'),
        Vector2 = require('vector2'),
        Accel = require('ui/accel'),
        Vibe = require('ui/vibe'),

        // require firebase.js
        //var
        //Firebase = require('src/js/vendor/firebase.js'),
        Firebase = require('firebase'),

        //firebase ref
        //var
        firebaseRef = new Firebase("https://pebblereminder.firebaseio.com/"),
        //var chatRef = new Firebase('https://fiery-fire-2493.firebaseio.com/chat');

        //set up cards
        prompt = new UI.Card({
            title: 'Posture',
            //icon: 'images/menu_icon.png',
            //subtitle: '',
            body: 'Did you have proper posture for the last hour? '
        }),

        answer = new UI.Card({
            //will be set later
        }),

        //from https://github.com/pebble-hacks/hackathon-watchface/blob/master/src/app.js
        watchFace = new UI.Window({
            fullscreen: true
        }),

        timeText = new UI.TimeText({
            position: new Vector2(0, 144),
            size: new Vector2(144, 24),
            font: 'gothic-18-bold',
            text: '%H:%M:%S',
            textAlign: 'center'
        }),

        hackathonLogo = new UI.Image({
            position: new Vector2(0, 0),
            size: new Vector2(144, 144),
            backgroundColor: 'clear',
            image: 'images/pebble.png'
        }),
        cityName = 'London',
        URLw = 'http://api.openweathermap.org/data/2.5/weather?q=' + cityName,
        URL = 'https://pebblereminder.firebaseio.com/message_list.json';

    answer.hide(); //for good measure

    watchFace.add(hackathonLogo);
    watchFace.add(timeText);
    watchFace.show();
    //end watchface

    function callAjax() {
        ajax({
                url: 'http://api.theysaidso.com/qod.json',
                type: 'json'
            },
            function (data, status, request) {
                console.log('Quote of the day is: ' + data.contents.quote);
            },
            function (error, status, request) {
                console.log('The ajax request failed: ' + error);
            }
        );
    }

    prompt.action({
        up: 'images/yes.png',
        down: 'images/no.png'
    });

    prompt.on('click', 'up', function () {
        //send request to firebase
        //set interval
        showBodyMessage('Good Job');
        console.log('Hi Nick!!!');
        callAjax();
    });

    prompt.on('click', 'down', function () {
        //send request to firebase
        showBodyMessage(' Its Ok. Pick back up the next hour');
    });

    // Make the request
    ajax({
            url: URLw,
            type: 'json'
        },
        function (data) {
            // Success!
            console.log('Successfully fetched weather data!');

            // Extract data
            var location = data.name;
            var temperature = Math.round(data.main.temp - 273.15) + "C";

            // Always upper-case first letter of description
            var description = data.weather[0].description;
            description = description.charAt(0).toUpperCase() + description.substring(1);
            console.log(description);

        },
        function (error) {
            // Failure!
            console.log('Failed fetching weather data: ' + error);
        }
    );

    ajax({
            url: URL,
            type: 'json'
        },
        function (data) {
            // Success!
            console.log('Nick got firebse!');
            // Extract data
            //var location = data.name;
            //var temperature = Math.round(data.main.temp - 273.15) + 'C';
            //console.log('location is' + location + 'and temp is ' + temperature);
            //console.log('location is' + location);
            // Always upper-case first letter of description
            console.log('Nick the data is' + JSON.stringify(data));
            //   var description = data.weather[0].description;
            //   description = description.charAt(0).toUpperCase() + description.substring(1);
            //     console.log('description is ' + description);
        },
        function (error) {
            // Failure!
            console.log('Failed fetching weather data: ' + error);
        }
    );

    var req = new XMLHttpRequest();
    req.open('GET', 'https://api.github.com/', true);
    req.onload = function (e) {
        if (req.readyState == 4 && req.status == 200) {
            if (req.status == 200) {
                var response = JSON.parse(req.responseText);
                var temperature = response.list[0].main.temp;
                var icon = response.list[0].main.icon;
                console.log('NICK' + response);
                Pebble.sendAppMessage({
                    'icon': icon,
                    'temperature': temperature + '\u00B0C'
                });
            } else {
                console.log('Error');
            }
        }
    }
    req.send(null);


    function showBodyMessage(answerBody) {
        answer.body(answerBody);
        prompt.hide();
        answer.show();
        setTimeout(function () {
            watchFace.show(); //end of the state
            //firebaseRef.set({id:1, description:'test', location:'robotsconf'});
        }, 2000);
    }

    prompt.show();

    // Send a long vibration to the user wrist
    Vibe.vibrate('long');

}());
