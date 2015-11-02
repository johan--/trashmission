var ip = '10.102.100.44';
var port = 1337;
var upperBound = 21;

angular.module('trashmission.controllers', [])

.controller('HomeCtrl', function($state) {
  var vm = this;

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

  vm.firstTrashcan;

  var map = L.map('map').setView([37.7848981, -122.4111284], 14);

  var geoJson = {
    "type": "FeatureCollection",
    "features": [
        {
            "type": "Feature",
            "properties": {
                "id": "1",
                "title": "",
                "description": "Trashcan 1",
                "marker-size": "medium",
                "marker-color": "#fa946e",
                "color": "orange",
                "marker-symbol": "waste-basket"
            },
            "geometry": {
                "coordinates": [
                  -122.4098852,
                  37.7620421
                ],
                "type": "Point"
            },
            "id": "0bacc02753dd2a086bf171920183d0ce"
        },
        {
            "type": "Feature",
            "properties": {
                "id": "2",
                "title": "",
                "description": "Trashcan 2",
                "marker-size": "medium",
                "marker-color": "#f86767",
                "color": "red",
                "marker-symbol": "waste-basket"
            },
            "geometry": {
                "coordinates": [
                    -122.419281,
                    37.775192
                ],
                "type": "Point"
            },
            "id": "19f580878d4b3c15a7e0bdc77341f117"
        },
        {
            "type": "Feature",
            "properties": {
                "id": "3",
                "title": "",
                "description": "Trashcan 3",
                "marker-size": "medium",
                "marker-color": "#f86767",
                "color": "red",
                "marker-symbol": "waste-basket"
            },
            "geometry": {
                "coordinates": [
                    -122.43134,
                    37.785469
                ],
                "type": "Point"
            },
            "id": "4c82dbaf9145488a268691a67e3a526a"
        },
        {
            "type": "Feature",
            "properties": {
                "id": "4",
                "title": "",
                "description": "Trashcan 4",
                "marker-size": "medium",
                "marker-color": "#fa946e",
                "color": "orange",
                "marker-symbol": "waste-basket"
            },
            "geometry": {
                "coordinates": [
                    -122.407135,
                    37.790353
                ],
                "type": "Point"
            },
            "id": "4e80de41cfc76b6a36c6d86ed418fea2"
        },
        {
            "type": "Feature",
            "properties": {
                "id": "5",
                "title": "",
                "description": "Trashcan 5",
                "marker-size": "medium",
                "marker-color": "#a3e46b",
                "color": "green",
                "marker-symbol": "waste-basket"
            },
            "geometry": {
                "coordinates": [
                    -122.421383,
                    37.785707
                ],
                "type": "Point"
            },
            "id": "74787c506bc2b66b095b81cbb5c45e67"
        },
        {
            "type": "Feature",
            "properties": {
                "id": "6",
                "title": "",
                "description": "Trashcan 6",
                "marker-size": "medium",
                "marker-color": "#f86767",
                "color": "red",
                "marker-symbol": "waste-basket"
            },
            "geometry": {
                "coordinates": [
                    -122.412672,
                    37.784961
                ],
                "type": "Point"
            },
            "id": "a289176219e397bf85041027a9c24745"
        },
        {
            "type": "Feature",
            "properties": {
                "id": "7",
                "title": "",
                "description": "Trashcan 7",
                "marker-size": "medium",
                "marker-color": "#f86767",
                "color": "red",
                "marker-symbol": "waste-basket"
            },
            "geometry": {
                "coordinates": [
                    -122.423443,
                    37.795711
                ],
                "type": "Point"
            },
            "id": "b71814d327911fc75e2cc158a1471007"
        },
        {
            "type": "Feature",
            "properties": {
                "id": "8",
                "title": "",
                "description": "Trashcan 8",
                "marker-size": "medium",
                "marker-color": "#f86767",
                "color": "red",
                "marker-symbol": "waste-basket"
            },
            "geometry": {
                "coordinates": [
                    -122.43061,
                    37.780789
                ],
                "type": "Point"
            },
            "id": "d80de7a3cc8f95fffbbd4272955e141b"
        },
        {
            "type": "Feature",
            "properties": {
                "id": "9",
                "title": "",
                "description": "Trashcan 9",
                "marker-size": "medium",
                "marker-color": "#a3e46b",
                "color": "green",
                "marker-symbol": "waste-basket"
            },
            "geometry": {
                "coordinates": [
                    -122.429451,
                    37.775124
                ],
                "type": "Point"
            },
            "id": "ee98b35656888c5f45493f39ab179a7a"
        }
    ],
    "id": "rcliao.cigfua5ev854ztdm6xuj8jj1g"
  };

  L.geoJson(geoJson, {
    onEachFeature: function (feature, layer) {
        layer.bindPopup(feature.properties.description);
    },
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

      if (feature.properties.id === '1') {
        console.log('assigning first trashcan');
        vm.firstTrashcan = marker;
      }

      return marker;
    }
  }).addTo(map);

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
      vm.firstTrashcan.setIcon(redMarker);
    } else {
      vm.firstTrashcan.setIcon(greenMarker);
    }
  });
})

.controller('TrashcanDetailCtrl', function($scope, $state, $stateParams, $filter) {
  var vm = this;

  var trashcanDom = document.getElementById('trashcan');
  var timeFilter = $filter('date');

  $scope.series = ['Temperature'];
  vm.binarySeries = ['Fill', 'Tilted'];
  vm.binaryColours = ['Red', 'Green']
  vm.labels = [];
  vm.temperatureData = [[]];
  vm.binaryData = [[], []];
  vm.chartOptions = {
    animation: false
  };

  connectToBoard(ip, port);

  vm.id = $stateParams.id;

  vm.goBack = goBack;

  function goBack () {
    $state.go('home');
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

      vm.binaryData[0].push(allEvent.distance <= Math.floor(upperBound/2) ? 1 : 0);
      vm.binaryData[1].push(allEvent.tilted ? 1 : 0);

      if (vm.labels.length > 5) {
        vm.binaryData[0] = vm.binaryData[0].slice(1);
        vm.binaryData[1] = vm.binaryData[1].slice(1);
      }

      setTemperature(allEvent.temperature);
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

    vm.labels.push(timeFilter(new Date(), 'mediumTime'));
    vm.temperatureData[0].push(temperature);

    $scope.$digest();
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
