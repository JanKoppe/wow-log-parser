# wow-log-parser
[![Build Status](https://travis-ci.org/JanKoppe/wow-log-parser.svg?branch=master)](https://travis-ci.org/JanKoppe/wow-log-parser)

node.js library to parse World of Warcraft combat log files.

## Status

This library is still in **early development** and not really usable right now. Come back later, or feel free to contribute!

## Usage

```javascript

const parse = require('wow-log-parser')

var logEvent = parse.line('2/9 10:27:07.883  SPELL_HEAL,Player-570-026543A2,"Voutz-Lothar",0x511,0x0,Player-570-0691B0F8,"Amphie-Lothar",0x512,0x0,81269,"Erblühen",0x8,Player-570-0691B0F8,0000000000000000,2608269,2608269,0,34085,0,1100000,1100000,0,-3478.55,4407.83,858,17622,17622,0,nil')

console.log(JSON.stringify(logEvent))
```

```JSON
{
  "date": "2017-02-09T09:27:07.883Z",
  "event": "SPELL_HEAL",
  "source": {
    "guid": "Player-570-026543A2",
    "name": "Voutz-Lothar",
    "flags": 1297,
    "raidflags": 0
  },
  "target": {
    "guid": "Player-570-0691B0F8",
    "name": "Amphie-Lothar",
    "flags": 1298,
    "raidflags": 0
  },
  "spell": {
    "id": "81269",
    "name": "Erblühen",
    "school": "Nature"
  },
  "eventSuffix": "HEAL",
  "amount": null,
  "overheal": 0,
  "absorbed": 2608269,
  "critical": 2608269
}
```

## Dependencies

None.

Okay, `mocha` for running tests, but who needs tests, anyway?

## Resources

Combat log format: [WoWpedia COMBAT_LOG_EVENT](http://wow.gamepedia.com/COMBAT_LOG_EVENT).