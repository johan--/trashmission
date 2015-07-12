var B = 3975;
var mraa = require("mraa");

//temperature
var temperaturePin = new mraa.Aio(0);
 
//Tilt meter
var analogPin0Y = new mraa.Aio(3); 
var analogPin1X = new mraa.Aio(4);
var analogPin2Z = new mraa.Aio(5);

//GPS
var GPSSensor = require('jsupm_ublox6');
var myGPSSensor = new GPSSensor.Ublox6(0);
var bufferLength = 256;
var nmeaBuffer  = new GPSSensor.charArray(bufferLength);

//Buzzer
var groveSpeaker = require('jsupm_grovespeaker');
var mySpeaker = new groveSpeaker.GroveSpeaker(8);

//ultrasonic
var μs = require('microseconds');

var echoPin = new mraa.Gpio(3);
var trigPin = new mraa.Gpio(4);

var defaultDistance = 0; // centimètre 
var prevDistance = 0;
var counter = 0;
var adjustment = 3; // centimètre
var lock = false;
var maximumRange = 500; // Maximum range needed
var minimumRange = 3; // Minimum range needed
var unlockReadyCounter = 0;
var unlockReadyCounterAdjusment = 0;
var loopDelay = 60; // ms
var LOW = 0;
var HIGH = 1;

trigPin.dir(mraa.DIR_OUT);
echoPin.dir(mraa.DIR_IN);
////////////////

var sockets ={};


setInterval(function () {
        console.log(getTemperatureReadingInFarenheit());
    console.log(getGPSInfo());
    console.log("is tilt: " + isTiltOrNot());
      // Play a medium C-sharp
    if (isTiltOrNot()) {
       playTune("c c g g a a g");

    }
    
    var pulseOn, pulseOff;
    var duration, distance;
    trigPin.write(LOW); 
    usleep(2);
    trigPin.write(HIGH);
    usleep(10); 
    trigPin.write(LOW);
    
    while (echoPin.read() == 0) {
        pulseOff = μs.now();

    }
    while (echoPin.read() == 1) {
        pulseOn = μs.now();
    }
    duration = pulseOn - pulseOff;
    distance = parseInt(duration / 58.2);
    if (
        !distance ||
        (!defaultDistance && prevDistance > 0)
       ) {
        init();
        defaultDistance = distance;
        //console.log("defaultDistance: " + defaultDistance + "cm.");
    } else if ( 
            distance >= maximumRange ||
            distance <= minimumRange ||
            defaultDistance <= distance ||
            defaultDistance > prevDistance
            ) { // lock condtion
        lockCounter();
    } else if (
            (defaultDistance - adjustment) > distance
            ) { // unlock condtion
        unlockCounter();
        //console.log("unlockReadyCounter: " + unlockReadyCounter + " count.");
        //console.log(" -> Distance: " + distance + "cm.");
    }
    if (lock == false) {
        lockCounter();
        counter++;
       // console.log("Counter: " + counter + ".");
        //console.log(" -> Distance: " + distance + "cm.");
    }
    if (distance && unlockReadyCounter == 0) {
        prevDistance = distance;
    }
    
    
    console.log("distance: "+distance);
    
    
    
    
    for (var i = 0; i < sockets.length; i++) {
       sockets[i].emit("message", getTemperatureReadingInFarenheit());
       }
    
    }, 1000);

function playTune(notes)
{
  var noteArray = notes.split(" ");
  for(var i=0; i<noteArray.length;i++)
  {
        mySpeaker.playSound(noteArray[i], true, "med");   
             usleep(100000);
  }
    
    
    
}


if (!myGPSSensor.setupTty(GPSSensor.int_B9600))
{
	console.log("Failed to setup tty port parameters");
	process.exit(0);
}

function getGPSInfo()
{
	// we don't want the read to block in this example, so always
	// check to see if data is available first.
	if (myGPSSensor.dataAvailable())
	{
		var rv = myGPSSensor.readData(nmeaBuffer, bufferLength);

		var GPSData, dataCharCode, isNewLine, lastNewLine;
		var numlines= 0;
		if (rv > 0)
		{
			GPSData = "";
			// read only the number of characters
			// specified by myGPSSensor.readData
			for (var x = 0; x < rv; x++)
            {
                
             GPSData += nmeaBuffer.getitem(x);
             if(nmeaBuffer.getitem(x)==="\n")
             {
            
            var flag = GPSData.substring(0,6);
            //console.log("flag: "+flag);
            if(flag==="$GPGGA")
            {
             
                var dataArray = GPSData.split(",");
                var latitude = dataArray[2]/100;
                var longtitude = dataArray[4]/100;
                var result = {
                  "latitude": latitude,
                  "longtitude": longtitude
                };
                return result;
                //console.log("lat: "+latitude+" longtitude: "+longtitude);
                
                
            }
            else if(flag==="$GPGLL")
            {
                
             console.log(GPSData);   
            }
                 GPSData="";
             }

            }
            
        
            
                //process.stdout.write(GPSData)
		}

		if (rv < 0) // some sort of read error occured
		{
			console.log("Port read error.");
			process.exit(0);
		}
	}
}


function getTemperatureReadingInFarenheit()
{
         var a =  temperaturePin.read();
        //console.log("Checking....");
        
        var resistance = (1023 - a) * 10000 / a; //get the resistance of the sensor;
        //console.log("Resistance: "+resistance);
        var celsius_temperature = 1 / (Math.log(resistance / 10000) / B + 1 / 298.15) - 273.15;//convert to temperature via datasheet ;
        //console.log("Celsius Temperature "+celsius_temperature); 
        var fahrenheit_temperature = (celsius_temperature * (9 / 5)) + 32;
        return fahrenheit_temperature;

}


function isTiltOrNot()
{   
   
    var x = analogPin0Y.read(); //read the value of the analog pin
    var y = analogPin1X.read();
    var z = analogPin2Z.read();

    //console.log(x + "," + y + "," + z); //write the value of the analog pin to the console
    var isTippedOver = (x < 300 || x > 400) || (y < 300 || y > 400);
    return isTippedOver;    
    
}



function usleep(us) {
    start = μs.now();
    while (true) {
        if (μs.since(start) > us) {
            return;
        }
    }
}

function lockCounter() {
    unlockReadyCounter = 0;
    lock = true;
}

function unlockCounter() {
    if (unlockReadyCounter > unlockReadyCounterAdjusment) {
        unlockReadyCounter = 0;
        lock = false;
    } else {
        unlockReadyCounter++;
    }   
}

function init() {
    lock = true;
    defaultDistance = 0;
    prevDistance = 0;
    unlockReadyCounter = 0;
 }

//Create Socket.io server
var http = require('http');
var app = http.createServer(function (req, res) {
    'use strict';
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('<h1>Hello world from Intel IoT platform!</h1>');
}).listen(1337);
var io = require('socket.io')(app);

//Attach a 'connection' event handler to the server
io.on('connection', function (socket) {
    'use strict';
    console.log('a user connected');
    //Emits an event along with a message
    socket.emit('connected', 'Welcome');

    //Start watching Sensors connected to Galileo board
    //startSensorWatch(socket);
     sockets.push(socket);
    //Attach a 'disconnect' event handler to the socket
    socket.on('disconnect', function () {
        console.log('user disconnected');
    });
});

