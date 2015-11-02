var ip = '10.102.100.44';
var port = 1337;
var upperBound = 21;

angular.module('trashmission.controllers', [])

.controller('HomeCtrl', function($scope, $state, $http) {
  var vm = this;

  vm.city = 'Inner Mission/Bernal Heights';

  var redMarker = L.AwesomeMarkers.icon({
    prefix: 'ion',
    icon: 'android-delete',
    markerColor: 'red'
  });
  var orangeMarker = L.AwesomeMarkers.icon({
    prefix: 'ion',
    icon: 'android-delete',
    markerColor: 'orange'
  });
  var greenMarker = L.AwesomeMarkers.icon({
    prefix: 'ion',
    icon: 'android-delete',
    markerColor: 'green'
  });
  vm.markers = [];

  vm.route = route;

  function route () {
    var options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0
    };

    if (!vm.control) {
      navigator.geolocation.getCurrentPosition(success, error, options);
    } else {
      vm.control.removeFrom(map);
      vm.control = null;
    }

    function error (error) {
      alert(error.message);
    }

    function success (pos) {
      var coords = pos.coords;
      var waypoints = [L.latLng(coords.latitude, coords.longitude)]

      waypoints = waypoints.concat(vm.markers.filter(function(marker) {
        return marker.feature.properties.color === 'red';
      }).map(function(marker) {
        return marker.getLatLng();
      }));
      vm.control = L.Routing.control({
        waypoints: waypoints
      }).addTo(map);
    }
  }

  var map = L.map('map').setView([37.7620421, -122.4098852], 14);

  $http.get('/json/trashcans.json').then(function(response) {
    var trashcanJson = response.data;
    L.geoJson(trashcanJson, {
      pointToLayer: function (feature, latlng) {
        var marker;

        if (feature.properties.color === 'red') {
          marker = L.marker(latlng, {icon: redMarker});
        } else if (feature.properties.color === 'orange') {
          marker = L.marker(latlng, {icon: orangeMarker});
        } else {
          marker = L.marker(latlng, {icon: greenMarker});
        }

        marker.on('click', function(event) {
          $state.go('trashcan-detail', {id: feature.properties.id})
        });

        vm.markers.push(marker);

        return marker;
      }
    }).addTo(map);
  });
  $http.get('/json/sf-neighborhood.json').then(function(response) {
    var sfGeoJson = response.data;
    L.geoJson(sfGeoJson, {
      onEachFeature: function(feature, layer) {
        layer.setStyle({
          color: '#33cd5f',
          weight: 2,
          opacity: 0.6,
          fillOpacity: 0.1,
          fillColor: '#33cd5f'
        });
        layer.on('click', function() {
          map.fitBounds(layer.getBounds());
          vm.city = feature.properties.name;
          $scope.$digest();
        });
      }
    }).addTo(map);
  })

  L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
    minZoom: 13,
    maxZoom: 18,
    id: 'rcliao.cigfua5ev854ztdm6xuj8jj1g',
    accessToken: 'pk.eyJ1IjoicmNsaWFvIiwiYSI6ImNpZ2Z1YTZzdjd1ZXl0bW01eTl1N3JrNngifQ.wLdfXWUF0P2H2kiQxrjGXA'
  }).addTo(map);

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

    if (allEvent.distance <= Math.floor(upperBound/2) || allEvent.tilted) {
      vm.markers[0].feature.properties.color = 'red';
      vm.markers[0].setIcon(redMarker);
    } else {
      vm.markers[0].feature.properties.color = 'green';
      vm.markers[0].setIcon(greenMarker);
    }
  });
})

.controller('TrashcanDetailCtrl', function($scope, $state, $stateParams, $filter) {
  var vm = this;

  var trashcanDom = document.getElementById('trashcan');
  var timeFilter = $filter('date');

  initializeChart();
  // connectToBoard(ip, port);

  setInterval(function() {
    updateChart({temperature: Math.random() * 100});
  }, 300);

  vm.id = $stateParams.id;

  vm.goBack = goBack;

  function goBack () {
    $state.go('home');
  }

  function initializeChart () {
    vm.temperatureChartDom = $('#temperature_chart')
      .epoch(
        {
          type: 'time.line',
          axes: ['left', 'bottom', 'right'],
          data: [{
            label: 'Temperature',
            values: []
          }, {
            label: 'Tilted',
            values: [],
            range: 'range-r'
          }, {
            label: 'Fill',
            values: [],
            range: 'range-r'
          }],
          range: {
            left: [0, 180],
            right: [0, 1]
          },
        }
      );
  }

  function updateChart (allData) {
    if (vm.temperatureChartDom) {
      vm.temperatureChartDom.push([
        {time: (new Date().getTime()/1000), y: allData.temperature},
        {time: (new Date().getTime()/1000), y: Math.random() > .7 ? 1: 0},
        {time: (new Date().getTime()/1000), y: Math.random() > .9 ? 1: 0}
      ]);
    }
  }

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
      setTilted(allEvent.tilted);

      if (allEvent.distance > Math.floor(upperBound/2)) {
        setTrashLevel(8);
      } else {
        setTrashLevel(27);
      }

      setTemperature(allEvent.temperature);

      updateChart(allEvent);
    });
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

  function setTilted (tilted) {
    trashcanDom.classList.toggle('tilted', tilted);
  }

  function setTemperature (temperature) {
    if (vm.labels.length > 5) {
      vm.labels = vm.labels.slice(1);
      vm.temperatureData[0] = vm.temperatureData[0].slice(1);
    }
  }

  function setTrashLevel (level) {
    var upperBound = 30;
    var fillLevel = document.getElementById('fill-level');

    var tilted = trashcanDom.classList.contains('tilted');

    level = Math.round((level / upperBound) * 20);

    if (fillLevel) {
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
    }
  }
})
