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

// starts at 1
module.exports.schools = ['Physical', 'Holy', 'Holystrike', 'Fire',
                'Flamestrike', 'Holyfire', '', 'Nature',
                'Stormstrike', 'Holystorm', '', 'Firestorm',
                '', '', '', 'Frost',
                'Froststrike', 'Holyfrost', '', 'Frostfire',
                '', '', '', 'Froststorm',
                '', '', '', 'Elemental',
                '', '', '', 'Shadow',
                'Shadowstrike', 'Twilight', '', 'Shadowflame',
                '', '', '', 'Plague',
                '', '', '', '',
                '', '', '', 'Shadowfrost',
                '', '', '', '',
                '', '', '', '',
                '', '', '', '',
                '', '', '', 'Arcane',
                'Spellstrike', 'Divine', '', 'Spellfire',
                '', '', '', 'Astral',
                '', '', '', '',
                '', '', '', 'Spellfrost',
                '', '', '', '',
                '', '', '', '',
                '', '', '', '',
                '', '', '', 'Spellshadow',
                '', '', '', '',
                '', '', '', '',
                '', '', '', '',
                '', '', '', '',
                '', '', '', '',
                '', '', '', '',
                '', '', '', 'Chromatic (Chaos)',
                '', 'Magic', 'Chaos'
              ]

// starts at -2
module.exports.powers = ['Health', '', 'Mana', 'Rage', 'Focus', 'Energy', '', 'Runes', 'Runic Power']
