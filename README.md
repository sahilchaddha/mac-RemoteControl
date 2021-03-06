# Unix Remote Control (IOT) 

[![NPM](https://nodei.co/npm/unix-remotecontrol.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/unix-remotecontrol/)


[![Build Status](https://travis-ci.org/sahilchaddha/unix-remotecontrol.svg?branch=master)](https://travis-ci.org/sahilchaddha/unix-remotecontrol)
[![npm](https://img.shields.io/npm/dm/unix-remotecontrol.svg)](https://www.npmjs.com/package/unix-remotecontrol)
[![npm](https://img.shields.io/npm/v/unix-remotecontrol.svg)](https://www.npmjs.com/package/unix-remotecontrol)
[![GitHub release](https://img.shields.io/github/release/sahilchaddha/unix-remotecontrol.svg)](https://github.com/sahilchaddha/unix-remotecontrol)
[![GitHub issues](https://img.shields.io/github/issues/sahilchaddha/unix-remotecontrol.svg)](https://github.com/sahilchaddha/unix-remotecontrol)
[![GitHub closed pull requests](https://img.shields.io/github/issues-pr-closed/sahilchaddha/unix-remotecontrol.svg)](https://github.com/sahilchaddha/unix-remotecontrol)






Runs Scripts on Mac/Linux remotely.

## Why :

I was setting up homebridge (iOS HomeKit Accesory Protocol) on my rasberryPi and after hooking up my IR Blaster, RF Transmitter and other wake-on-lan devices. I wanted my always-on OSX Laptop to also be remotely controlled by my iOS Device. So i ended up writing up a small plugin for [Homebridge](https://github.com/nfarina/homebridge) [plugin](https://github.com/sahilchaddha/homebridge-unixcontrol). 

I use this to play itunes, search google and bookmark search results, restart my system, get room temperature using MBP in-build Temp Sensor and adjust airconditioning accordingly, monitor my ec-2 instance stats, sync Spotify Playlist etc.

Homebridge Plugin => [homebridge-unixcontrol](https://github.com/sahilchaddha/homebridge-unixcontrol)

## How it Works :

This library is directly injected into homebridge with a plugin wrapper => [homebridge-unixcontrol](https://github.com/sahilchaddha/homebridge-unixcontrol)

The plugin queries the system using HTTP API and run shell scripts. The shell requires sudo access to shutdown/reboot the system. More commands can be easily be injected. Feel free to PR.

You can ask Siri to execute commands : 

`Hey Siri, Shutdown my laptop`

`Hey Siri, play iTunes Playlist`

`Hey Siri, Good Morning ! // Plays Music, Backups OSX, Search for Google Alerts, Turns Off Air Conditioner`

`Hey Siri, Capture Laptop Webcam`

`Hey Siri, Who's using my laptop`

## Todo :

- [ ] Add Linux Support
- [ ] Add Windows Support
- [ ] Refactor With Promises
- [ ] Replace HTTP API with socket connection.
- [ ] Implement a working Example
- [ ] Security Concerns


## Installation :

```
 $ npm install -g unix-remotecontrol
```

### Starting Server :

```
 $ unixremote
```

### Running Forever

```
 $ npm install -g forever
 $ git clone https://github.com/sahilchaddha/unix-remoteControl.git && cd unix-remoteControl
 $ forever start src/server.js
```

## Configuration :

Configuration containing sudo password, port number, logLevel & sessionToken are stored in `environment.js` in root/src.

To Open Configuration for global module : 

```
 $ unixremote --config
```

Sample Configuration :

``` 
//environment.js
var env = {
    port: '3000',
    pass: 'lol', //sudo password TODO: Secure
    logLevel: 'info',
    sessionToken: 'f64f2940-fae4-11e7-8c5f-ef356f279131'
}

module.exports = env
```

### Config Parameters


| Fields             | Description                                           |
|--------------------|-------------------------------------------------------|
| port               | Port Number to run HTTP Server.                       |
| pass               | System Sudo Password                                  |
| logLevel           | Log Level (debug, info, error)                        |
| sessionToken       | Random Session Token for API Authentication.          |


**NOTE**: `sessionToken` needs to be set as Request Header `token`


## Usage :

After Running the server, You can request

`localhost:portNumber/commandType/command`

e.g.



```
POST localhost:3000/power/shutdown
    {
        "time": 10
    }
```


```
curl --header "token: f64f2940-fae4-11e7-8c5f-ef356f27913" -X POST localhost:3000/power/logout

curl --header "token: f64f2940-fae4-11e7-8c5f-ef356f27913" "Content-Type: application/json" -X POST -d '{"time":10}' localhost:3000/power/restart 

curl --header "token: f64f2940-fae4-11e7-8c5f-ef356f27913" "Content-Type: application/json" -X POST -d '{"destination":"AppleMusic"}' localhost:3000/music/syncSpotify
```

## Sample Scripts/Commands : 

### Power Command Type 

Usage:- 

`localhost:3000/power/displaySleep`

```
POST localhost:3000/power/restart
    {
        "time": 10
    }
```

| Command             | Method | Description                                           | Params | Sudo |
|--------------------|---------|-------------------------------------------------------|----------| ----- |
| /ping      | GET | Pings to get server state (on/off)         | None       | false |
| /halt           | POST | Shutdowns immediately & forcibly (Can cause data loss)                          | None      | true |
| /shutdown              | POST | Shut downs the system                                 | `time` (minutes) : Delays Shutdown in minutes       | true |
| /restart           | POST | Restarts the system | `time` (minutes) : Delays Shutdown in minutes      | true |
| /logout         | POST | Logs Out the user (OSX Only)                                  | None      | false |
| /sleep         | POST | Turns the System to Sleep                       | None       | false |
| /displaySleep        | POST | Turns the Display to Sleep                      | None       | false |
| /cancelShutdown        | POST | Cancels Scheduled Shutdown/Restart Task                      | None       | true |

### System Stats Command Type 

Usage:- 

`localhost:3000/systemStats/temperature`

`localhost:3000/systemStats/ram`

| Command             | Method | Description                                           | Params | Sudo |
|--------------------|---------|-------------------------------------------------------|----------| ----- |
| /temperature      | GET | Returns current Temperature of CPU         | None       | false |
| /cpuLoad           | GET | Returns current CPU Load                          | None      | false |
| /ram               | GET | Returns current Ram Status                                 | None       | false |
| /storage           | GET | Returns current Storage Stats | None      | false |
| /battery         | GET | Returns current Battery Information                                  | None      | false |

### Browser Command Type 

Usage:- 

`localhost:3000/browser/googleChromeReset `

| Command             | Method | Description                                           | Params | Sudo |
|--------------------|---------|-------------------------------------------------------|----------| ----- |
| /googleChromeReset      | POST | Clear all data of google chrome and reset         | None       | false |
| /safariClearHistory      | POST | Clear histroy of safari        | None       | false |

**NOTE**: For safariClearHistory you will have to add terminal or whatever command line tool you are using should be added in System Preferences -> Security & Privacy -> Privacy -> Accessibility. When you run this command for the first time there will a prompt to add command line tool in Accessibility.

### Wi-fi Command Type 

Usage:- 

`localhost:3000/wifi/on `

| Command             | Method | Description                                           | Params | Sudo |
|--------------------|---------|-------------------------------------------------------|----------| ----- |
| /status      | GET | Returns Wifi Enabled/Disabled Status (OS X Only)       | None       | false |
| /on      | POST | Turn on wifi (OS X Only)        | None       | false |
| /off      | POST | Turn off wifi (OS X Only)       | None       | false |
| /connect      | POST | Connect to wifi (OS X Only)       | `name`: wifi name, `password`: wifi password       | false |

### Bluetooth Command Type 

Usage:- 

`localhost:3000/bluetooth/status `

| Command             | Method | Description                                           | Params | Sudo |
|--------------------|---------|-------------------------------------------------------|----------| ----- |
| /status      | GET | Returns Bluetooth Enabled/Disabled Status (OS X Only)       | None       | false |
| /on      | POST | Turn on Bluetooth (OS X Only)        | None       | false |
| /off      | POST | Turn off Bluetooth (OS X Only)       | None       | false |
| /showPairingAlert      | POST | Show pairing alert or pair with any BLE enabled device (OS X Only)     |  `deviceName`: Bluetooth name of device with percentage encoding       | false |
| /toggle        | POST | Toggle device bluetooth connection (OS X Only)     |  `deviceName`: Bluetooth name of device with percentage encoding       | false |

**NOTE**: [blueutil](https://github.com/imsrc21/blueutil) is added as a depedancy for Bluetooth Connections. It will be automatically installed during `npm install`. Its added as postInstall Script in `package.json`. If for some reason installation of blueutil fails, you can manually install blueutil `brew install blueutil`

### System Spy Command Type 

Usage:- 

`localhost:3000/systemSpy/screenshot`

`localhost:3000/systemSpy/camRecord`

```
localhost:3000/systemSpy/alert
    {
        "message": "Heeeyyy !!! Hooooo !!!"
    }
```

```
localhost:3000/systemSpy/notify
    {
        "title": "heyyy",
        "message": "hooo"
    }
```

| Command             | Method | Description                                           | Params | Sudo |
|--------------------|---------|-------------------------------------------------------|----------| ----- |
| /screenshot      | POST | Screenshots Current Screen, Saves & returns image (OSX Only)         | None       | false |
| /webcamCapture      | POST | Clicks Camera Still, Saves & returns image (OSX Only)         | None       | false |
| /screenRecord           | POST | Starts Screen Recording (OSX Only)                          | `time` (In Minutes): Start recording for specific time.  Here time is optional if you want to run this command forever than do not pass any arguments      | false |
| /camRecord               | POST | Starts Camera Recording (OSX Only)                                 | `time` (In Minutes): Start recording for specific time.  Here time is optional if you want to run this command forever than do not pass any arguments       | false |
| /alert           | POST | Shows Alert to User | `message`: Message to Show Alert      | false |
| /notify           | POST | Shows Notification to User | `title`: Title For Notification, `message`: Message      | false |
| /isRecording         | GET | Returns Recording Status (OSX Only)                                  | `type` : `screen` or `cam` type of recording      | false |

### Music Command Type 

Usage:- 

`localhost:3000/music/itunesPlaylist`

```
localhost:3000/music/setVolume
    {
        "volume": 10
    }
```

| Command             | Method | Description                                           | Params | Sudo |
|--------------------|---------|-------------------------------------------------------|----------| ----- |
| /youtubePlaylist      | POST | Opens Youtube & Starts Playing Playlist defined in `environment.js` (OSX Only)         | None       | false |
| /itunesPlaylist      | POST | Opens iTunes & Starts Playing Playlist defined in `environment.js` (OSX Only)         | None       | false |
| /setVolume           | POST | Sets New Volume (OSX Only)                          | `volume`: volume to be set. Should be between 0 to 10      | false |
| /getVolume               | GET | Returns Current Volume (OSX Only)                                 | None       | false |
| /mute           | POST | Mutes the System (OSX Only)                          | None      | false |
| /unmute               | POST | UnMutes the System (OSX Only)                                 | None       | false |
| /isMuted           | GET | Returns Mute Status (OSX Only)                          | None      | false |


### Todo Scripts :
- [ ] Remote System Backup
- [ ] Remote System Format (Need extra OSX Device to test. :P )


## Writing Custom Scripts :

Cloning the Repo : 

```
 $ git clone https://github.com/sahilchaddha/unix-remoteControl.git && cd unix-remoteControl
 $ node src/server.js
 or
 $ npm start
```

Creating Your Router :

You can create your custom router inside `Routes` folder.

```
//DummyRouter.js
var router = require('express').Router() // Create New Router
var commandService = require('../Services/CommandService.js')

router.get('/hello', function (req, res) {
  res.send('Hello')
  // Run Your npm commands
  // or call Shell Scripts using Command Service

    commandService.execute('dummy', 'sayHello', options, function(){})
})

module.exports = router
```

Adding your Router to Valid Routes :

Add your custom router inside `routes.js`

```
var powerRouter = require('./Routes/PowerRouter.js')
var dummyRouter = require('./Routes/DummyRouter.js')

var routes = [
    {
        url: '/power',
        routerClass: powerRouter
    },
    {
        url: '/dummy',
        routerClass: dummyRouter
    }
]

module.exports = routes
```

Adding Your Shell Scripts :

You can use Command Service to execute commands : 

To add Commands, you can inject your commands inside `Commands/commands.js`

```
var dummyCommands = {
    sayHello: {
        command: ['say', 'hello'],
        sudo: false // Set as true if command need sudo access
    }
}

module.exports = {
    // power: powerCommands,
    dummy: dummyCommands
}
```


### Apple Scripts

Apple scripts in format `.scpt` are to be injected inside `AppleScripts` folder.

You can add command inside `commands.js` 

```
var dummyCommands = {
    sayHello: {
        command: ['say', 'hello'],
        sudo: false // Set as true if command need sudo access
    },
    runAppleScript: {
        command: ['osascript', 'src/Commands/AppleScripts/dummyAS.scpt'],
        sudo: false
    }
}

module.exports = {
    // power: powerCommands,
    dummy: dummyCommands
}
```


## Homebridge on Raspberry Pi :

### Homebridge Configuration : 

WIP

### On Pi : 

```
$ ssh pi@192.168.1.2 // Your Pi Local Address
$ npm install -g homebridge
$ npm install -g homebridge-unixcontrol

// Configure Homebridge config.json
```

### On Unix System (For Remote Access) : 

```
$ npm install -g unix-remotecontrol
$ unixremote --config //Setup Your Configuration
$ unixremote
```


## Credits : 
Sahil Chaddha (mail@sahilchaddha.com)

Sumit Chudasama (imsrc21@gmail.com)

## Reference :

- [HashinKit](https://github.com/shogo4405/HaishinKit.swift)

- [BlueUtil](https://github.com/toy/blueutil)