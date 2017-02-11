'use strict';
/*
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
    throw new TypeError('school #' + school + ' is not valid.')
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
  if (power < - 2 || power > c.powers.length - 3 || c.powers[power + 2] === '') {
    throw new TypeError('power #' + power + 'is not valid.')
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
  
  // ignore these special events and return immediately
  switch(o.event) {
    case 'ENCHANT_APPLIED':
    case 'ENCHANT_REMOVED':
    case 'PARTY_KILL':
    case 'UNIT_DIED':
    case 'UNIT_DESTROYED':
    case 'UNIT_DISSIPATES':
      return o
      break
    default:
      break
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
    case 'EXTRA_ATTACKS':
      o.amount = parseInt(l.shift())
      break
    case 'AURA_APPLIED':
    case 'AURA_REMOVED':
    case 'AURA_APPLIED_DOSE':
    case 'AURA_REMOVED_DOSE':
    case 'AURA_REFRESH':
      o.auraType = l.shift().replace(/"/g,'')
      o.amount = parseInt(l.shift())
      break
    case 'AURA_BROKEN':
      o.auraType = l.shift().replace(/"/g,'')
      break
    case 'CAST_FAILED':
      o.failedType = l.shift().replace(/"/g,'')
      break
    case 'CAST_START':
    case 'CAST_SUCCESS':
    case 'INSTAKILL':
    case 'DURABILITY_DAMAGE':
    case 'DURABILITY_DAMAGE_ALL':
    case 'CREATE':
    case 'SUMMON':
    case 'RESURRECT':
      break
    default:
      throw new Error('unrecognized event suffix ' + o.eventSuffix)
      break
  }
  
  return o
}


//do smart stuff here

module.exports = parse
