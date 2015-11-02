(function(document, io, fetch) {
  'use strict';

  // image data using base64 encode, due to lack of designer
  var canImageUrl = {
    empty: 'images/svg/trash-can-empty.svg',
    veryLow: 'images/svg/trash-can-very-low.svg',
    veryLowTilted: 'images/svg/trash-can-very-low-tilted.svg',
    high: 'images/svg/trash-can-high.svg',
    highTilted: 'images/svg/trash-can-high-tilted.svg'
  };
  var upperBound = 21;

  var tilted = false;
  var eventLogs = [];
  var currentWeather = {};

  // Grab a reference to our auto-binding template
  // and give it some initial binding values
  // Learn more about auto-binding templates at http://goo.gl/Dx1u2g
  var app = document.querySelector('#app');

  app.displayInstalledToast = function() {
    document.querySelector('#caching-complete').show();
  };

  // See https://github.com/Polymer/polymer/issues/1381
  window.addEventListener('WebComponentsReady', function() {
    // imports are loaded and elements have been registered
    var cityMap = document.getElementById('city-map');
    cityMap.styles =[
      {
        "featureType": "poi",
        "stylers": [
          { "visibility": "off" }
        ]
      },{
        "featureType": "administrative",
        "stylers": [
          { "visibility": "simplified" }
        ]
      },{
        "featureType": "landscape",
        "stylers": [
          { "visibility": "off" }
        ]
      },{
        "featureType": "water",
        "stylers": [
          { "visibility": "off" }
        ]
      },{
        "featureType": "road",
        "elementType": "labels",
        "stylers": [
          { "visibility": "off" }
        ]
      },{
        "featureType": "transit",
        "stylers": [
          { "visibility": "off" }
        ]
      },{
        "featureType": "road",
        "elementType": "geometry",
        "stylers": [
          { "color": "#80d380" }
        ]
      },{
      }
    ];

    var trashCan1 = document.getElementById('trash-can-1')
      .icon = canImageUrl.veryLow;
    var trashCan2 = document.getElementById('trash-can-2')
      .icon = canImageUrl.veryLow;
    var trashCan3 = document.getElementById('trash-can-3')
      .icon = canImageUrl.veryLow;
    var trashCan4 = document.getElementById('trash-can-4')
      .icon = canImageUrl.veryLow;
    var trashCan5 = document.getElementById('trash-can-5')
      .icon = canImageUrl.empty;
    var trashCan6 = document.getElementById('trash-can-6')
      .icon = canImageUrl.veryLowTilted;
    var trashCan7 = document.getElementById('trash-can-7')
      .icon = canImageUrl.high;

    document.querySelector('paper-button.route')
      .addEventListener('click', function() {
        var map = document.getElementById('city-map').map;
        document.querySelectorAll('google-map-directions')[0].map = map;
        document.querySelectorAll('google-map-directions')[1].map = map;
      });
  });

  // Close drawer after menu item is selected if drawerPanel is narrow
  app.onMenuSelect = function() {
    var drawerPanel = document.querySelector('#paperDrawerPanel');
    if (drawerPanel.narrow) {
      drawerPanel.closeDrawer();
    }
  };

  function getRandomValue(offset, factor) {
    return offset + Math.round(factor * Math.random());
  }

  function getFillLevelColor (level) {
    if (level > 15) {
      return '#F44336';
    } else if (level > 10) {
      return '#FFC107';
    } else if (level > 5) {
      return '#FFEB3B';
    } else {
      return '#4CAF50';
    }
  }

  function setTemperature (temperature) {
    var gauge = document.getElementById('mutating_gauge');
    gauge.data = [["Label", "Value"],["Temperature", temperature]];
  }

  function setTilted () {
    var trashCan = document.querySelector('.trash-can');
    trashCan.classList.add('tilted');
    tilted = true;
  }

  function setUntilted () {
    var trashCan = document.querySelector('.trash-can');
    trashCan.classList.remove('tilted');
    tilted = false;
  }

  function setTrashLevel (level) {
    var fillLevel = document.getElementById('fill-level');
    var upperBound = 30;

    level = Math.round((level / upperBound) * 20);

    if (tilted) {
      fillLevel.setAttribute('y', 11);
      fillLevel.setAttribute('height', 19);
      fillLevel.setAttribute('x', 26-level);
      fillLevel.setAttribute('width', level);
      fillLevel.setAttribute('fill', getFillLevelColor(level));
    } else {
      fillLevel.setAttribute('x', 6);
      fillLevel.setAttribute('width', 20);
      fillLevel.setAttribute('y', 30-level);
      fillLevel.setAttribute('height', level);
      fillLevel.setAttribute('fill', getFillLevelColor(level));
    }

    var trashCan1 = document.getElementById('trash-can-1');

    if (tilted) {
      if (level > Math.floor(upperBound / 2)) {
        trashCan1.icon = canImageUrl.highTilted;
      } else {
        trashCan1.icon = canImageUrl.veryLowTilted;
      }
    } else {
      if (level > Math.floor(upperBound / 2)) {
        trashCan1.icon = canImageUrl.high;
      } else {
        trashCan1.icon = canImageUrl.veryLow;
      }
    }
  }

  function appendEvent (event) {
    var eventTable = document.getElementById('event-table');
    // unshift to push to beginning
    eventLogs.unshift(event);

    eventTable.data = eventLogs;

    // hack to get table redraw
    eventTable.refreshPagination(true);
  }

  function getCurrentWeather (lat, lon) {
    fetch('http://api.openweathermap.org/data/2.5/weather' +
        '?lat=' + lat +
        '&lon='+ lon
      )
      .then(function(res) {
        return res.json();
      })
      .then(function(data) {
        // data format:
        // {
        //  main: {
        //    temp: number, (in Kelvin unit)
        //    pressure: number,
        //    humidity: number
        //  },
        //  weather: [
        //    {
        //      description: String
        //    }
        //  ]
        // }
        currentWeather = data;

        // dummy way to replace dom one by one
        document.querySelector('.temp-1')
          .textContent = ((data.main.temp - 273.15) * 1.8 + 32).toFixed(2);
        document.querySelector('.humidity-1')
          .textContent = data.main.humidity.toFixed(2);
        document.querySelector('.description-1')
          .textContent = data.weather[0].description;

        // replace the detail view
        document.querySelector('.local-weather .meta .location')
          .textContent = data.name;
        document.querySelector('.local-weather .meta .weather')
          .textContent = data.weather[0].description;
        document.querySelector('.local-weather .meta .temp')
          .textContent = ((data.main.temp - 273.15) * 1.8 + 32).toFixed(2);
        document.querySelector('.local-weather .meta .humidity')
          .textContent = data.main.humidity.toFixed(2);
      });
  }

  getCurrentWeather(34.0183573, -118.489185);

  connectToBoard('10.102.100.44', '1337');

  function connectToBoard (ip, port) {
    var socket = io.connect('http://' + ip + ':' + port);

    // Attach a 'connected' event handler to the socket
    socket.on("connected", function (message) {
        // Sanity check
        console.log(message);
    });

    // message JSON String format
    // {
    //  lat: number,
    //  long: number,
    //  tilted: boolean,
    //  temperature: number (in Fer),
    //  distance: number (in CM)
    // }
    socket.on("message", function (message) {
      var allEvent = JSON.parse(message);
      if (allEvent.tilted === true) {
        setTilted();
      } else {
        setUntilted();
      }

      if (allEvent.distance > Math.floor(upperBound/2)) {
        setTrashLevel(8);
      } else {
        setTrashLevel(27);
      }

      setTemperature(Math.round(allEvent.temperature));

      appendEvent({
        Timestamp: new Date(),
        'Trash Level': allEvent.distance,
        Temperature: allEvent.temperature,
        Tilted: allEvent.tilted ? 'Yes': 'No',
        Longitude: allEvent.long,
        Latitude: allEvent.lat
      });
    });
  }

})(document, io, fetch);
