var UI = require('ui');
var ajax = require('ajax');
var Vector2 = require('vector2');
var Accel = require('ui/accel');
var Vibe = require('ui/vibe');

// require firebase.js
//var Firebase = require('/src/js/firebase.js');
//var Firebase = require('firebase');


//firebase ref
//var firebaseRef = new Firebase("https://pebblereminder.firebaseio.com/");
//var chatRef = new Firebase('https://fiery-fire-2493.firebaseio.com/chat');

//set up cards
var prompt = new UI.Card({
    title: 'Posture',
    //icon: 'images/menu_icon.png',
    //subtitle: '',
    body: 'Did you have proper posture for the last hour? '
});

var answer = new UI.Card({
    //will be set later
});
answer.hide(); //for good measure

//from https://github.com/pebble-hacks/hackathon-watchface/blob/master/src/app.js
var watchFace = new UI.Window({
    fullscreen: true
});

var time_text = new UI.TimeText({
    position: new Vector2(0, 144),
    size: new Vector2(144, 24),
    font: 'gothic-18-bold',
    text: '%H:%M:%S',
    textAlign: 'center'
});

var hackathon_logo = new UI.Image({
    position: new Vector2(0, 0),
    size: new Vector2(144, 144),
    backgroundColor: 'clear',
    image: 'images/pebble.png',
});

watchFace.add(hackathon_logo);
watchFace.add(time_text);
watchFace.show();
//end watchface

prompt.action({
    up: 'images/yes.png',
    down: 'images/no.png',
});

prompt.on('click', 'up', function() {
    //send request to firebase
    //set interval
    showBodyMessage('Good Job');
    console.log("Hi Nick!!!")
});

prompt.on('click', 'down', function() {
    //send request to firebase
    showBodyMessage(' Its Ok. Pick back up the next hour');
});

//var cityName = 'London';
//var URL = 'http://api.openweathermap.org/data/2.5/weather?q=' + cityName;
var URL = 'https://pebblereminder.firebaseio.com/message_list.json';

ajax(
  {
    url: URL,
    type: 'json'
  },
  function(data) {
    // Success!
    console.log('Successfully fetched weather data!');
      // Extract data
     //var location = data.name;
     //var temperature = Math.round(data.main.temp - 273.15) + 'C';
     //console.log('location is' + location + 'and temp is ' + temperature);
     //console.log('location is' + location);
  // Always upper-case first letter of description
     console.log("Nick the data is" + JSON.stringify(data)); 
//   var description = data.weather[0].description;
//   description = description.charAt(0).toUpperCase() + description.substring(1);
//     console.log('description is ' + description);

    
  },
  function(error) {
    // Failure!
    console.log('Failed fetching weather data: ' + error);
  }
);

function showBodyMessage(answerBody) {
    answer.body(answerBody);
    prompt.hide();
    answer.show();
    setTimeout(function(){
        watchFace.show();  //end of the state
        //firebaseRef.set({id:1, description:'test', location:'robotsconf'});
    }, 2000);
}

prompt.show();

// Send a long vibration to the user wrist
Vibe.vibrate('long');

