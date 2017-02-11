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

const assert = require('assert')
const parse = require('../index')
const constants = require('../lib/constants')

// This is just template-foo. replace with real tests.
describe('parse', () => {
  describe('#school()', () => {
    it('should recognize 1 as Physical', () => assert.equal(parse.school(1), 'Physical'))
    it('should recognize 2 as Holy', () => assert.equal(parse.school(2), 'Holy'))
    it('should recognize 3 as Holystrike', () => assert.equal(parse.school(3), 'Holystrike'))
    it('should recognize 4 as Fire', () => assert.equal(parse.school(4), 'Fire'))
    it('should recognize 5 as Flamestrike', () => assert.equal(parse.school(5), 'Flamestrike'))
    it('should recognize 6 as Holyfire', () => assert.equal(parse.school(6), 'Holyfire'))
    it('should recognize 8 as Nature', () => assert.equal(parse.school(8), 'Nature'))
    it('should recognize 9 as Stormstrike', () => assert.equal(parse.school(9), 'Stormstrike'))
    it('should recognize 19 as Holystorm', () => assert.equal(parse.school(10), 'Holystorm'))
    it('should recognize 12 as Firestorm', () => assert.equal(parse.school(12), 'Firestorm'))
    it('should recognize 16 as Frost', () => assert.equal(parse.school(16), 'Frost'))
    it('should recognize 17 as Froststrike', () => assert.equal(parse.school(17), 'Froststrike'))
    it('should recognize 18 as Holyfrost', () => assert.equal(parse.school(18), 'Holyfrost'))
    it('should recognize 20 as Frostfire', () => assert.equal(parse.school(20), 'Frostfire'))
    it('should recognize 24 as Froststorm', () => assert.equal(parse.school(24), 'Froststorm'))
    it('should recognize 32 as Shadow', () => assert.equal(parse.school(32), 'Shadow'))
    it('should recognize 33 as Shadowstrike', () => assert.equal(parse.school(33), 'Shadowstrike'))
    it('should recognize 34 as Twilight', () => assert.equal(parse.school(34), 'Twilight'))
    it('should recognize 36 as Shadowflame', () => assert.equal(parse.school(36), 'Shadowflame'))
    it('should recognize 40 as Plague', () => assert.equal(parse.school(40), 'Plague'))
    it('should recognize 48 as Shadowfrost', () => assert.equal(parse.school(48), 'Shadowfrost'))
    it('should recognize 64 as Arcane', () => assert.equal(parse.school(64), 'Arcane'))
    it('should recognize 65 as Spellstrike', () => assert.equal(parse.school(65), 'Spellstrike'))
    it('should recognize 66 as Divine', () => assert.equal(parse.school(66), 'Divine'))
    it('should recognize 68 as Spellfire', () => assert.equal(parse.school(68), 'Spellfire'))
    it('should recognize 72 as Astral', () => assert.equal(parse.school(72), 'Astral'))
    it('should recognize 80 as Spellfrost', () => assert.equal(parse.school(80), 'Spellfrost'))
    it('should recognize 96 as Spellshadow', () => assert.equal(parse.school(96), 'Spellshadow'))
    it('should recognize 124 as Chromatic (Chaos)', () => assert.equal(parse.school(124), 'Chromatic (Chaos)'))
    it('should recognize 126 as Magic', () => assert.equal(parse.school(126), 'Magic'))
    it('should recognize 127 as Chaos', () => assert.equal(parse.school(127), 'Chaos'))
    it('should throw error for values < 1', () => assert.throws(() => parse.school(0), TypeError))
    for (let i = 1; i <= constants.schools.length; i++) {
      if (constants.schools[i - 1] === '') {
        it('should throw error for value ' + i, () => assert.throws(() => parse.school(i), TypeError))
      }
    }
    it('should throw error for values > 127', () => assert.throws(() => parse.school(128), TypeError))
  })
  describe('#power()', () => {
    it('should throw error for values < -2', () => assert.throws(() => parse.power(-3), TypeError))
    it('should recognize -2 as Health', () => assert.equal(parse.power(-2), 'Health'))
    it('should throw error for value -1', () => assert.throws(() => parse.power(-1), TypeError))
    it('should recognize 0 as Mana', () => assert.equal(parse.power(0), 'Mana'))
    it('should recognize 1 as Rage', () => assert.equal(parse.power(1), 'Rage'))
    it('should recognize 2 as Focus', () => assert.equal(parse.power(2), 'Focus'))
    it('should recognize 3 as Energy', () => assert.equal(parse.power(3), 'Energy'))
    it('should recognize 5 as Runes', () => assert.equal(parse.power(5), 'Runes'))
    it('should recognize 6 as Runic Power', () => assert.equal(parse.power(6), 'Runic Power'))
    it('should throw error for values > 6', () => assert.throws(() => parse.power(7), TypeError))
  })
  describe('#date()', () => {
    let now = new Date()

    // this could have been so easy..
    // let dateString = now.toLocaleFormat('%m/%d %H:%M:%S.%f')
    let dateString = (now.getMonth() + 1) + 
      '/' + now.getDate() + ' ' + 
      ('0' + now.getHours()).slice(-2) + ':' + 
      ('0' + now.getMinutes()).slice(-2) + ':' + 
      ('0' + now.getSeconds()).slice(-2) + '.' + 
      ('00' + now.getMilliseconds()).slice(-3)

    it('should parse the current date correctly', () => {
      assert.equal(parse.date(dateString).getTime(), now.getTime())
    })
  })
})
