
const _   = require('underscore');

let sg = {};

let seconds = sg.seconds = sg.second = 1000,        second = seconds;
let minutes = sg.minutes = sg.minute = 60*seconds,  minute = minutes;
let hours   = sg.hours   = sg.hour   = 60*minutes,  hour   = hours;
let days    = sg.days    = sg.day    = 24*hours,    day    = days;
let weeks   = sg.weeks   = sg.week   = 7*days,      week   = weeks;
let months  = sg.months  = sg.month  = 30*days,     month  = months;
let years   = sg.years   = sg.year   = 365*days,    year   = years;



_.each(sg, function(value, key) {
  exports[key] = value;
});

