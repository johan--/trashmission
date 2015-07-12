/*
Copyright (c) 2015 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

(function(document, io) {
  'use strict';

  // Grab a reference to our auto-binding template
  // and give it some initial binding values
  // Learn more about auto-binding templates at http://goo.gl/Dx1u2g
  var app = document.querySelector('#app');

  app.displayInstalledToast = function() {
    document.querySelector('#caching-complete').show();
  };

  // Listen for template bound event to know when bindings
  // have resolved and content has been stamped to the page
  app.addEventListener('dom-change', function() {
    console.log('Our app is ready to rock!');
  });

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
  });

  // Close drawer after menu item is selected if drawerPanel is narrow
  app.onMenuSelect = function() {
    var drawerPanel = document.querySelector('#paperDrawerPanel');
    if (drawerPanel.narrow) {
      drawerPanel.closeDrawer();
    }
  };

  Notification.requestPermission();

  function getRandomGaugeValue(offset, factor) {
    return offset + Math.round(factor * Math.random());
  }

  function getFillLevelColor (level) {
    if (level > 15) {
      return '#673AB7';
    } else if (level > 10) {
      return '#3F51B5';
    } else if (level > 5) {
      return '#2196F3';
    } else {
      return '#2196F3';
    }
  }
  var eventLogs = [];
  window.setInterval(function() {
    var temperature = getRandomGaugeValue(40, 40);
    var gauge = document.getElementById('mutating_gauge');
    gauge.data = [["Label", "Value"],["Temperature", temperature]];

    var trashCan = document.querySelector('.trash-can');
    var fillLevel = document.getElementById('fill-level');
    var level = getRandomGaugeValue(0, 20);

    if (getRandomGaugeValue(0, 1) === 1) {
      trashCan.classList.add('tilted');
      fillLevel.setAttribute('y', 11);
      fillLevel.setAttribute('height', 19);
      fillLevel.setAttribute('x', 26-level);
      fillLevel.setAttribute('width', level);
      fillLevel.setAttribute('fill', getFillLevelColor(level));
    } else {
      trashCan.classList.remove('tilted');
      fillLevel.setAttribute('x', 6);
      fillLevel.setAttribute('width', 20);
      fillLevel.setAttribute('y', 30-level);
      fillLevel.setAttribute('height', level);
      fillLevel.setAttribute('fill', getFillLevelColor(level));
    }

    var eventTable = document.getElementById('event-table');
    eventLogs.unshift({
      Time: new Date(),
      Level: level,
      Temperature: temperature
    });

    eventTable.data = eventLogs;

    // hack to get table redraw
    eventTable.refreshPagination(true);
  }, 1000);

  // var socket = io.connect('http://10.60.0.88:1337');

  // //Attach a 'connected' event handler to the socket
  // socket.on("connected", function (message) {
  //     //Load page with transition
  //     console.log(message);
  // });

  // socket.on("message", function (message) {
  //   console.log(message);
  // });

})(document, io);
