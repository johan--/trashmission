

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
var mySpeaker = new groveSpeaker.GroveSpeaker(2);

//ultrasonic
var μs = require('microseconds');


var sockets ={};


setInterval(function () {
        console.log(getTemperatureReadingInFarenheit());
    console.log(getGPSInfo());
    console.log("is tilt: " + isTiltOrNot());
      // Play a medium C-sharp
    if (isTiltOrNot()) {
       playTune("c c g g a a g");

    }
    for (var i = 0; i < sockets.length; i++) {
       sockets[i].emit("message", getTemperatureReadingInFarenheit());
       }
    
    }, 4000);

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

    console.log(x + "," + y + "," + z); //write the value of the analog pin to the console
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

