/*//2/9 10:27:09.574  SPELL_HEAL,Player-570-026543A2,"Voutz-Lothar",0x511,0x0,Pet-0-3772-1456-19003-1863-01026A23C5,"Betanda",0x1112,0x0,81269,"Erblühen",0x8,Pet-0-3772-1456-19003-1863-01026A23C5,Player-570-0691B0F8,1043308,1043308,20451,34085,3,200,200,0,-3476.96,4405.28,858,15325,15325,0,nil

 *    wow-log-parser - Parse World of Warcraft combat logs
 *   Copyright (C) 2017   Jan Koppe <post@jankoppe.de>
 *
 *   This program is free software: you can redistribute it and/or modify
 *   it under the terms of the GNU General Public License as published by
 *   the Free Software Foundation, either version 3 of the License, or
 *   (at your option) any later version.
 *
 *   This program is distributed in the hope that it will be useful,
 *   but WITHOUT ANY WARRANTY; without even the implied warranty of
 *   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *   GNU General Public License for more details.
 *
 *   You should have received a copy of the GNU General Public License
 *   along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

const c = require('./constants')

const parseHex = (str) => parseInt(str.substring(2), 16)

var parse = {}

/**
 * parse spell school
 * @param  {Integer} school Integer representation of school
 * @return {String}         String representation of spell School
 */
parse.school = (school) => {
  if (typeof school !== 'number') {
    school = parseInt(school)
    if (school.isNaN) throw new TypeError('school has wrong format.')
  }
  if (school < 1 || school > c.schools.length || c.schools[school - 1] === '') {
    throw new TypeError('school is not valid.')
  }
  return c.schools[school - 1]
}

/**
 * parse power type
 * @param  {Integer} power Integer representation of power
 * @return {String}         String representation of power type
 */
parse.power = (power) => {
  if (typeof power !== 'number') {
    power = parseInt(power)
    if (power.isNaN) throw new TypeError('power has wrong format.')
  }
  if (power < - 2 || power > c.powers.length - 1 || c.powers[power + 2] === '') {
    throw new TypeError('power is not valid.')
  }
  return c.powers[power + 2]
}

/**
 * parse a single line and return it as Object
 * @param  {String} line    line from the WoWCombatLog.txt
 * @param  {Integer} version Log version. Ignored for now.
 * @return {Object}         Object representation of line
 */
parse.line = (line, version) => {
  let o = {}
  o.date = new Date()
  let l = line.split('  ')
  let d = l[0].split(' ')
  
  // including a date library for this would be overkill. works.
  o.date.setMonth(d[0].split('/')[0] - 1)
  o.date.setDate(d[0].split('/')[1])
  o.date.setHours(d[1].split(':')[0])
  o.date.setMinutes(d[1].split(':')[1])
  o.date.setSeconds(d[1].split(':')[2].split('.')[0])
  o.date.setMilliseconds(d[1].split(':')[2].split('.')[1])
  
  l = l[1].split(',')
    
  o.event = l.shift()
  o.source = {
    "guid": l.shift(),
    "name": l.shift().replace(/"/g,''),
    "flags": parseHex(l.shift()),
    "raidflags": parseHex(l.shift())
  }
  o.target = {
    "guid": l.shift(),
    "name": l.shift().replace(/"/g,''),
    "flags": parseHex(l.shift()),
    "raidflags": parseHex(l.shift())
  }
  
  //sometimes events do not have targets. remove target property.
  if (o.target.name === undefined) o.target = undefined
  
  if (o.event.split('_')[0] === 'SPELL' 
      || o.event.split('_')[0] === 'RANGE' ) {
    o.spell = {
      "id": l.shift(),
      "name": l.shift().replace(/"/g,''),
      "school": parse.school(parseHex(l.shift()))
    }
  } else if (o.event.split('_')[0] === 'ENVIRONMENTAL') {
    o.environmentalType = l.shift()
  }
  
  let suffix = ''
  if (o.event.split('_')[1] === 'PERIODIC' 
      || o.event.split('_')[1] === 'BUILDING') {
    o.eventSuffix = o.event.split('_').splice(2).join('_')
  } else {
    o.eventSuffix = o.event.split('_').splice(1).join('_')
  }
  
  switch (o.eventSuffix) {
    case 'DAMAGE':
      o.amount = parseInt(l.shift())
      o.overkill = parseInt(l.shift())
      o.school = parseInt(l.shift())
      o.resisted = parseInt(l.shift())
      break
    case 'MISSED':
      o.missType = parseInt(l.shift())
      o.isOffhand = l.shift()
      o.amountMissed = parseInt(l.shift())
      break
    case 'HEAL':
      o.amount = parseInt(l.shift())
      o.overheal = parseInt(l.shift())
      o.absorbed = parseInt(l.shift())
      o.critical = parseInt(l.shift())
      break
    case 'ENERGIZE':
      o.amount = parseInt(l.shift())
      o.powerType = parse.power(parseHex(l.shift()))
      break
    case 'LEECH':
    case 'DRAIN':
      o.amount = parseInt(l.shift())
      o.powerType = parse.power(parseHex(l.shift()))
      o.extraAmount = parseInt(l.shift())
      break
    case 'INTERRUPT':
    case 'DISPEL_FAILED':
      o.extraSpellId = parseInt(l.shift())
      o.extraSpellName = l.shift().replace(/"/g,'')
      o.extraSchool = parse.school(parseHex(l.shift()))
    case 'DISPEL':
    case 'STOLEN':
    case 'AURA_BROKEN_SPELL':
      o.extraSpellId = parseInt(l.shift())
      o.extraSpellName = l.shift().replace(/"/g,'')
      o.extraSchool = parse.school(parseHex(l.shift()))
      o.auraType = l.shift().replace(/"/g,'')
    default:
      break
  }
  
  return o
}


//do smart stuff here

module.exports = parse
