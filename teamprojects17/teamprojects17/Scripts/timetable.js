/**
 * Timetable Object and its dependencies
 *
 * @Authors: Robert Deans
 *
 * This file contains the data structure for the timetable that will be used to manipulate data before it is rendered.
 */

/**
 * Main timetable constructor. This will be used to store ALL timetable data.
 *
 * @param semester
 * @param config
 * @constructor
 */
function Timetable(semester, config){

    /**
     * This contains global data that is relevant to timetable and all of its dependant classes
     *
     * @type {{numberOfWeeks: number, numberOfDays: number, numberOfPeriods: number}}
     */

    var semesterConfig = $.extend({
        numberOfWeeks : 15,
        numberOfDays : 5,
        numberOfPeriods : 9
    }, config);

    this.semester = semester; //The semester that the timetable represents

    this.weeks = []; //The array of all weeks in the semester - Contains all information

    this.config = semesterConfig;
}

/**
 *
 * @returns int:semester
 */
Timetable.prototype.getSemester = function() {
    return this.semester;
};

//TODO: Decide if timetable needs to contain multiple weeks, or whether a timetable created based off a week is better
/**
 * Takes the week number and returns all of the data about that week in the timetable
 *
 * @param week
 * @returns array
 */
Timetable.prototype.getWeek = function(week) {
    return this.weeks[week] ? this.weeks[week] : new Week();
};

/**
 *
 * @param week
 * @returns {Timetable}
 */
Timetable.prototype.addWeek = function (week) {
    if (week != null) {
        var w = new Week(this.config, week['week']);
        w.populate(week);
        this.weeks[w.week] = w;
        return this;
    }
};

/**
 * This populates the timetable with all of the data stored in data
 *
 * @param data
 * @returns {Timetable}
 */
Timetable.prototype.populate = function (data) {
    for (var i = 0; i < data.weeks.length; i++) {
        this.addWeek(data.weeks[i]);
    }
     return this;
};

Timetable.prototype.reshuffleWeeks = function(){
    var newWeeks = [];

    this.weeks.forEach(function(elem, i){
        newWeeks[elem.week] = elem;
    });
    this.weeks = newWeeks;
};

/**
 * This is the constructor for each week in the timetable object
 *
 * @param semesterConfig
 * @param week
 * @constructor
 */
function Week(semesterConfig, week){
    this.days = [];
    this.week = week;
    this.config = semesterConfig;
}

/**
 *
* @returns {*}
 */
Week.prototype.week = function() {
    return this.week;
};

/**
 *
 * @param day
 * @returns {*}
 */
Week.prototype.getDay = function(day) {
    return this.days[day] ? this.days[day] : new Day();
};

/**
 *
 * @param data
 * @returns {Week}
 */
Week.prototype.addDay = function(data) {
    var d = new Day(this.config, data.day);
    d.populate(data);
    this.days[d.day] = d;
    return this;
};

/**
 * This populates the each day of the week with the data
 *
 * @param data
 * @returns {Week}
 */
Week.prototype.populate = function(data){
    for (var i = 0; i < data['days'].length; i++) {
        this.addDay(data['days'][i]);
    }
    return this;
};

Week.prototype.reshuffleDays = function(){
    var newDays = [];

    this.days.forEach(function(elem, i){
        newDays[elem.day] = elem;
    });
    this.days = newDays;
};

/**
 * This is the constructor of each of the days in the week
 *
 * @param semesterConfig
 * @param day
 * @constructor
 */
function Day(semesterConfig, day){
    this.periods = [];
    this.day = day;
    this.config = semesterConfig;
}

/**
 *
 * @returns {*}
 */
Day.prototype.getDay = function(){
    return this.day;
};

/**
 *
 * @param period
 * @returns {*}
 */
Day.prototype.getPeriod = function(period) {
    return this.periods[period] ? this.periods[period] : new Period();
};

/**
 *
 * @param data
 * @param j
 * @returns {Day}
 */
Day.prototype.addPeriod = function(data) {
    var p = new Period(data['module'], data['period'], data['rooms'], data['weeks'], data['status'], data['type'], data['noOfStudents'], data['numberOfRooms']);
    p.populate(data);
    if (typeof this.periods[p.period] == "undefined") {
        this.periods[p.period] = [];
    }
    this.periods[p.period].push(p);
    return this;
};

Day.prototype.addEmptyPeriods = function( data , n) {
    var p;
    var temp = [];
    for(var i = 0; i < n; i++) {
        p = new Period(data['module'], data['period'], data['rooms'], data['weeks'], data['status'], data['type'], data['noOfStudents'], data['numberOfRooms']);
        p.populate(data);
        temp.push(p);
        //this.periods[p.period] = p;
        this.periods[p.period] = temp;
    }
    return this;
}

/**
 * This populates each day with a number of periods that are in data
 *
 * @param data
 * @returns {Day}
 */

Day.prototype.populate = function(data){
    console.log(data);
    
    for (var i = 0; i < data['periods'].length; i++) {
        if (data['periods'][i] != null) {
            console.log(i);
            var period = data['periods'][i];
            var rooms = period['rooms'];
            console.log(rooms.length);
            for (var j = 0; j < ObjectLength(rooms); j++) {
                data['rooms'] = [rooms[j]];
                console.log(period);
                this.addPeriod(data['periods'][i]);
            }
        }
    }
    return this;
};

Day.prototype.reshufflePeriods = function(){
    var newPeriods = [];

    this.periods.forEach(function(elem, i){
        newPeriods[elem[0].period] = elem;
    });
    this.periods = newPeriods;
};

/**
 *
 * @param module
 * @param period
 * @param rooms
 * @param weeks
 * @param status
 * @constructor
 */
function Period(module, period, rooms, weeks, status, type, noOfStudents, noOfRooms){
    this.module = module;
    this.period = period;
    this.rooms = rooms;
    this.weeks = weeks;
    this.status = status;
    this.type = type;
    this.noOfStudents = noOfStudents;
    this.noOfRooms = noOfRooms;
}

/**
 *
 * @param data
 * @returns {Period}
 */
Period.prototype.populate = function(data) {
    this.module = data['module'];
    this.period = data['period'];

    for (var i = 0; i < data['rooms']; i++) {
        this.addRoom(data['rooms']['name']);
    }

    for (var i = 0; i < data['weeks']; i++) {
        this.addWeeks(data['weeks']['start'], data['weeks']['end']);
    }

    this.status = data['status'];

    this.type = data['type'];

    this.noOfStudents = data['noOfStudents'];

    this.noOfRooms = data['numberOfRooms'];

    return this;
};

/**
 *
 * @param moduleCode
 * @param moduleName
 * @returns {Period}
 */
Period.prototype.setModule = function(moduleCode, moduleName) {

    this.module['code'] = moduleCode;
    this.module['name'] = moduleName;
    return this;
};

/**
 *
 * @param rooms
 * @returns {Period}
 */
Period.prototype.setRooms = function(rooms) {
    this.rooms = rooms;
    return this;
};

Period.prototype.setWeeks = function(weeks) {
    this.weeks = weeks;
    return this;
};

Period.prototype.setStatus = function(status) {
    this.status = status;
    return this;
}

/**
 *
 * @returns {*}
 */
Period.prototype.getModule = function() {
    return this.module;
};

/**
 *
 * @returns {*}
 */

Period.prototype.getTime = function() {
    return this.timeSlot;
};

/**
 *
 * @returns {*}
 */
Period.prototype.getRooms = function() {
    return this.rooms;
};

Period.prototype.getWeeks = function() {
    return this.weeks;
};

Period.prototype.getStatus = function() {
    return this.status;
};

/**
 *
 * @param name
 * @param status
 * @returns {Period}
 */
Period.prototype.addRoom = function(name, status) {
    this.rooms.add({ name: name });
    return this;
};

/**
 *
 * @param weekStart
 * @param weekEnd
 * @returns {Period}
 */
Period.prototype.addWeeks = function(weekStart, WeekEnd) {
    this.rooms.add({start: weekStart, end: weekEnd});
    return this;
};


Period.prototype.removeWeek = function(w, timetable) {
    timetable['weeks'].splice(w, 1);
    timetable.reshuffleWeeks();
}

Period.prototype.removeDay = function(w, d, timetable) {
    timetable['weeks'][w]['days'].splice(d, 1);
    timetable['weeks'][w].reshuffleDays();
}

Period.prototype.removePeriod = function(w, d, p, timetable) {
    timetable['weeks'][w]['days'][d]['periods'].splice(p, 1);
    timetable['weeks'][w]['days'][d].reshufflePeriods();
}


/**
* @param object: The object that has more objects inside
* @returns: number of objs inside
*/
function ObjectLength(object) {
    var length = 0;
    for (var key in object) {
        if (object.hasOwnProperty(key)) {
            ++length;
        }
    }
    return length;
}