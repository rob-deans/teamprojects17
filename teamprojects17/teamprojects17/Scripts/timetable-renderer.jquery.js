/**
 * timetable-renderer.jquery.js
 *
 * @Authors: Rob Deans
 *
 * This plugin manages the rendering of the timetable updating whenever there is a change and displaying
 * it all in a table format
 */

var weekNumber = 0; //Specific week number
var general = [];   //Information on all the weeks that are available

var specificWeek = false;   //If we are on a specific week or on the general tab

var numberOfRooms = 1; //How many rooms they are asking for

(function ($) {
        $.fn.timetableRenderer = function (timetable, options) {
            // Where all of the default settings for the renderer are stored
            var settings = $.extend({
                type: "general"
            }, options);
            console.log(timetable);
            /**
             *
             * @type {*|HTMLElement} - This is the HTML element that the timetable will be rendered inside
             */
            var $this = $(this);
            /**
             * Decides which timetable to render
             */
            if (settings.type == "general") {
                getUnavailableWeeks();
            } else {
                drawTimetable();
            }

            $(".period-holder").unbind("click");
            /**
             * When you click on a period it will select that period and all the weeks that you have asked for
             * assuming it is available,if not it will take you there afterwards
             */
            function initialisePeriodListener() {
                $(".period-holder").click(function (e) {

                    numberOfRooms = $("#rooms-list").children().length - 1;
                    numberOfRooms = numberOfRooms <= 0 ? 1 : numberOfRooms;

                    var $target = $(e.target);
                    var $this = $(this);
                    /*
                    Gets the element that you actually clicked and does one of two things
                     */
                    if ($target.hasClass("tag-close")) {
                        /*
                        If clicked the tag - remove all those weeks
                         */
                        var text = $target.parent().text();
                        text = text.substring(0, text.length - 1).split(" - ");
                        $target = $this.find(".period");
                        var day = $target.attr("data-day");
                        var curPeriod = $target.attr("data-period");
                        var weeks = JSON.parse($target.attr("data-weeks"));

                        for (var w = text[0] - 1; w <= text[1] - 1; w++) {
                            for (var n = 0; n < numberOfRooms; n++) {
                                if(checkWithinRange(w, weeks, text)) {
                                    unselectPeriod(w, day, curPeriod, n);
                                }
                            }
                        }

                        updatePeriods(text, weeks, day, curPeriod);

                        //Re-render it out with the updated information
                        var $holder = $target.parent().parent().parent().parent().parent()[0];
                        $($holder).timetableRenderer(timetable, settings);
                        return false;
                    }
                    var $this = $(this);
                    var DAYS = ["mo", "tu", "we", "th", "fr"];

                    /**
                     var s = the split of the id
                     var d = the day
                     var p = period number
                     */
                    var s = $this.attr('id').split('-');
                    var d = DAYS.indexOf(s[0]);
                    var p = s[1].substring(1, 2) - 1;

                    //var ranges : all the ranges that the user has selected
                    var ranges = getRanges();

                    var period;

                    if ($this.hasClass("unselected")) {

                        var modCode = $("#module-code").find('option:selected').val();
                        if (typeof modCode == "undefined") {
                            modCode = document.getElementById("module-code").getAttribute("value");
                        }
                        var modName = $("#module-name").find('option:selected').val();
                        if (typeof modName == "undefined") {
                            modName = $("#module-name").attr('value');
                        }

                        //Make sure they have a module selected
                        if (!(modCode == 0 || modName == 0)) {

                            for(var g = 0; g < timetable.config.numberOfWeeks; g++) {
                                if(typeof timetable['weeks'][g] != "undefined") {
                                    if(typeof timetable['weeks'][g]['days'][d] != "undefined") {
                                        if(typeof timetable['weeks'][g]['days'][d]['periods'][p] != "undefined") {
                                           if(timetable['weeks'][g]['days'][d]['periods'][p][0].getStatus() != "selected") {
                                               ranges = splitRanges(ranges, g);
                                           }
                                        }
                                    }
                                }
                            }

                            //General tab
                            if (settings.type == "general") {
                                for (var r = 0; r < ranges.length; r++) {
                                    for (var i = ranges[r][0] - 1; i < ranges[r][1]; i++) {
                                        for (var k = 0; k < numberOfRooms; k++) {
                                            expandObject(i, d, p);

                                            period = timetable['weeks'][i]['days'][d]['periods'][p][k];
                                            if (typeof period.rooms == "undefined") {
                                                period.setModule(modName, modCode);
                                                var temp = [];
                                                for (var t = 0; t < ranges.length; t++) {
                                                    temp.push({
                                                        start: Number(ranges[t][0]) - 1,
                                                        end: Number(ranges[t][1]) - 1
                                                    });
                                                }
                                                period.weeks = temp;
                                                period.rooms = getRooms(k);
                                                period.setStatus("selected");
                                                period.type = $("#type").val();
                                                period.noOfStudents = $("#required-capacity").val();
                                                period.noOfRooms = $("#number-of-rooms").val();

                                            } else {
                                                console.log("There is something already booked in " + i);
                                            }
                                        }
                                    }
                                }
                            } else {
                                for (var l = 0; l < numberOfRooms; l++) {
                                    expandObject(weekNumber, d, p);
                                    period = timetable['weeks'][weekNumber]['days'][d]['periods'][p][l];
                                    period.setModule(modName, modCode);
                                    var tempWeeks = getWeeks();
                                    period.weeks = tempWeeks;
                                    period.rooms = getRooms(l);
                                    period.setStatus("selected");
                                    period.type = $("#type").val();
                                    period.noOfStudents = $("#required-capacity").val();
                                    period.noOfRooms = $("#number-of-rooms").val();
                                    var holder;

                                    //Update all the weeks so that they include the specific week
                                    for(var q = 0; q < timetable.config.numberOfWeeks; q++) {
                                        if(typeof timetable['weeks'][q] != "undefined") {
                                            if(typeof timetable['weeks'][q]['days'][d] != "undefined") {
                                                if(typeof timetable['weeks'][q]['days'][d]['periods'][p] != "undefined") {
                                                    if(q != weekNumber) {
                                                        var checkTemp = timetable['weeks'][q]['days'][d]['periods'][p][l].getWeeks();
                                                        checkTemp.push(tempWeeks[0]);
                                                        holder = checkTemp;
                                                        timetable['weeks'][q]['days'][d]['periods'][p].weeks = holder;
                                                    }
                                                }
                                            }
                                        }
                                    }
                                    if(typeof holder != "undefined") {
                                        period.weeks = holder;
                                    }
                                }
                            }
                        }
                    }

                    var $tt = $this.parent().parent().parent().parent()[0];
                    $($tt).timetableRenderer(timetable, settings);

                });
            }

            function splitRanges(ranges, week) {
                var temp1 = null;
                var temp2 = null;
                for(var i = 0; i < ranges.length; i++) {

                    if(ranges[i][0] - 1 == week) {
                        ranges[i][0] = week + 2;
                    } else if (ranges[i][1]-1 == week) {
                        ranges[i][1] = week;
                    } else if(ranges[i][0]-1 < week && ranges[i][1]-1 > week) {
                        var holder = ranges[i][1];
                        ranges[i][1] = week;
                        temp1 = [ranges[i][0], ranges[i][1]];
                        ranges[i][0] = week + 2;
                        ranges[i][1] = holder;
                        temp2 = [ranges[i][0], ranges[i][1]];
                        ranges.splice(i,1);
                    }
                }
                if(temp1 != null || temp2 != null) {
                    ranges.push(temp1);
                    ranges.push(temp2);
                }
                return ranges;
            }

            //Button that removes the selection(s)
            $(".remove").click(function () {
                var DAYS = ["mo", "tu", "we", "th", "fr"];

                var s = $(this).parent().parent().attr('id').split('-');
                var d = DAYS.indexOf(s[0]);
                var p = s[1].substring(1, 2) - 1;

                var n = 0;
                var period = timetable['weeks'][weekNumber]['days'][d]['periods'][p][n].getWeeks();

                var numWeeks = getActualWeeks(timetable['weeks'][weekNumber]['days'][d]['periods'][p][n]);

                //If on a specific week only delete that weeks worth of information
                if (specificWeek && period.length == 1
                    && parseInt(period[0].start) == (weekNumber + 1) && parseInt(period[0].end) == (weekNumber + 1)) {

                    unselectPeriod(weekNumber, d, p, n);

                    //If on the general go through the weeks and delete
                } else if (!specificWeek) {
                    for (var i = 0; i < numWeeks.length; i++) {
                        unselectPeriod(numWeeks[i], d, p, n);
                    }

                    //Else split the weeks up
                } else {
                    for (var k = 0; k < numWeeks.length; k++) {
                        for (var g = 0; g < numberOfRooms; g++) {
                            changeWeeks(timetable['weeks'][numWeeks[k]]['days'][d]['periods'][p][g]);
                        }
                    }
                    unselectPeriod(weekNumber, d, p, n);
                }

            });

            function changeWeeks(period) {
                var temp = [];

                for (var i = 0; i < period.getWeeks().length; i++) {
                    var p = period.getWeeks()[i];
                    if (p.start < parseInt(weekNumber) && p.end > parseInt(weekNumber)) {
                        temp.push({start: p.start, end: parseInt(weekNumber) - 1});
                        temp.push({start: parseInt(weekNumber) + 1, end: p.end});
                    } else if (p.start == parseInt(weekNumber)) {
                        temp.push({start: parseInt(weekNumber) + 1, end: p.end});
                    } else if (p.end == parseInt(weekNumber)) {
                        temp.push({start: p.start, end: parseInt(weekNumber) - 1});
                    } else {
                        temp.push(p);
                    }
                }
                period.setWeeks(temp);
            }

            /**
             *
             * @param w : week you are removing
             * @param weeks : rest of the weeks
             * @param text
             */
            function checkWithinRange(w, weeks, text) {
                var length = ObjectLength(weeks);
                for(var i = 0; i < length; i++) {
                    if(!(Number(text[0]) - 1 == weeks[i].start && Number(text[1]) - 1 == weeks[i].end )) {
                        if (w >= weeks[i].start && w <= weeks[i].end) {
                            return false;
                        }
                    }
                }
                return true;
            }

            /**
             *
             * @param text : weeks you are removing
             * @param weeks : rest of the weeks
             * @param day
             * @param period
             */
            function updatePeriods(text, weeks, day, period) {
                for (var i = 0; i < weeks.length; i++) {
                    if (weeks[i].start == Number(text[0]) - 1 && weeks[i].end == Number(text[1]) - 1) {
                        weeks.splice(i, 1);
                    }
                }

                for (var j = 0; j < weeks.length; j++) {
                    for (var k = weeks[j].start; k < weeks[j].end + 1; k++) {
                        for (var n = 0; n < numberOfRooms; n++) {
                            if(typeof timetable['weeks'][k] != "undefined") {
                                timetable['weeks'][k]['days'][day]['periods'][period][n].setWeeks(weeks);
                            }
                        }
                    }
                }

            }

            /**
             *
             * @param period
             * @returns {Array} : array of the actual weeks that are there
             */
            function getActualWeeks(period) {
                var temp = [];
                for (var i = 0; i < period.getWeeks().length; i++) {
                    for (var j = period.getWeeks()[i].start; j < period.getWeeks()[i].end + 1; j++) {
                        temp.push(j);
                    }
                }
                return temp;
            }

            function unselectPeriod(w, d, p, n) {
                var period = timetable['weeks'][w];

                if(typeof(period) != "undefined") {
                    if (typeof period['days'][d] != "undefined") {
                        removeFromTimetable(period, w, d, p, n);
                        period = timetable['weeks'][w];
                        if (typeof period != "undefined" && typeof period['days'][d] != "undefined") {
                            period.getDay(d).getPeriod(p)[n].removePeriod(w, d, p, timetable);

                        }
                    }
                }
            }

            function removeFromTimetable(period, w, d, p, n) {
                if (checkWeek(period, period['days'][d])) {
                    period.getDay(d).getPeriod(p)[n].removeWeek(w, timetable);
                } else {
                    if (checkDay(period['days'][d])) {

                        period.getDay(d).getPeriod(p)[n].removeDay(w, d, timetable);
                    }
                }
            }

            /**
             *
             * @param week : current weeks we are looking at
             * @param day : same with day
             * @returns {boolean}
             */
            function checkWeek(week, day) {
                if (checkDay(day)) {
                    return getRealLength(week['days']).length == 1;
                }
            }

            function checkDay(day) {
                return getRealLength(day['periods']).length == 1;
            }

            /**
             * Expands the object so we can add more information, expands where necessary
             *
             * @param i : week
             * @param d : day
             * @param p : period
             */
            function expandObject(i, d, p) {
                if (typeof timetable['weeks'][i] == "undefined") {
                    timetable.addWeek({week: i, days: []});
                }

                if (typeof timetable['weeks'][i]['days'][d] == "undefined") {
                    timetable['weeks'][i].addDay({day: d, periods: []});
                }

                if (typeof timetable['weeks'][i]['days'][d]['periods'][p] == "undefined") {
                    timetable['weeks'][i]['days'][d].addEmptyPeriods({
                        module: {}, period: p, rooms: undefined, weeks: {start: -1, end: -1}
                    }, numberOfRooms);
                }
            }

            initialisePeriodListener();

            $(".week-selector").unbind('click');
            function initialiseWeekListener() {
                $(".week-selector").click(function () {
                    weekNumber = $(this).attr("data-week");
                    specificWeek = true;
                    $this.timetableRenderer(timetable, {type: "week"});
                });
            }

            initialiseWeekListener();

            $("#general").unbind("click");
            function initialiseGeneralListener() {
                $("#general").click(function () {
                    specificWeek = false;
                    console.log($this);
                    $this.timetableRenderer(timetable, {type: "general"});
                });
            }

            initialiseGeneralListener();

            /**
             * Basically get the weeks that are available and ready to be displayed by another function
             *
             */
            function getUnavailableWeeks() {
                var general = [];
                for (var m = 0; m < 15; m++) {
                    var numDays = getRealLength(timetable.getWeek(m)['days']);
                    for (var i = 0; i < numDays.length; i++) {
                        var curPeriod = timetable.getWeek(m)['days'][numDays[i]]['periods'];
                        var numPeriods = getRealLength(curPeriod);
                        for (var j = 0; j < numPeriods.length; j++) {
                            var temp = [];
                            for (var k = 0; k < timetable.config.numberOfWeeks; k++) {
                                if (typeof timetable.getWeek(k)['days'][numDays[i]] != "undefined") {
                                    if (typeof timetable.getWeek(k)['days'][numDays[i]] != "undefined") {
                                        if (typeof timetable.getWeek(k)['days'][numDays[i]]['periods'][numPeriods[j]] == "undefined") {
                                            temp.push(k);
                                        }
                                    } else {
                                        temp.push(k);
                                    }
                                } else {
                                    temp.push(k);
                                }
                            }
                            if (general.length == 0) {
                                general.push({ day: numDays[i], period: numPeriods[j], weeks: temp });
                            }
                            if(!containsObject(temp, general)){
                                general.push({ day: numDays[i], period: numPeriods[j], weeks: temp });
                            }
                        }
                    }
                }

                drawTimetable(general);
                initialisePeriodListener();
            }

            /**
             *
             * @param data
             * @returns {Array} : array containing the acutal postions of the timetable -> the length
             */
            function getRealLength(data) {
                var num = [];
                for (var i = 0; i < data.length; i++) {
                    if (typeof data[i] != "undefined") {
                        num.push(i);
                    }
                }
                return num;
            }

            /**
             *
             * @param general :the general obj
             * @param day : days
             * @param period : periods
             * @returns {string}
             */
            function drawAvailable(general, day, period) {
                //TODO: if we want change the way single weeks are displayed
                var weeksFree = "<div>Only available on...</div>";
                var ranges;
                var l = ObjectLength(general);
                for (var i = 0; i < l; i++) {
                    if (general[i].day == day && general[i].period == period) {
                        ranges = getWeeksInString(general[i]['weeks']);
                        if (ranges.length > 0) {
                            for (var r = 0; r < ranges.length; r++) {
                                weeksFree += "Weeks: " + ranges[r];
                            }
                        } else {
                            weeksFree = "<div>Unavailable</div>";
                        }
                    }
                }

                if (typeof ranges == "undefined" || general.length == 0) {
                    weeksFree = "<div></div>";
                }

                return weeksFree;
            }

            /**
             *
             * @param weeks : object containing all th weeks that we want
             * @returns {Array} : readable format ready to be displayed
             */
            function getWeeksInString(weeks) {
                var ranges = [];
                var start = weeks[0];
                for (var i = 0; i < weeks.length; i++) {
                    if (weeks[i] != weeks[i + 1] - 1) {
                        if (start == weeks[i]) {
                            ranges.push((Number(start) + 1));
                        } else {
                            ranges.push((Number(start) + 1) + " - " + (Number(weeks[i]) + 1));
                        }
                        start = weeks[i + 1];
                    }
                }
                return ranges;
            }

            /**
             * This function rerenders the timetable each time a change has been made
             *
             * @param general : all the information on the weeks that are available
             */
            function drawTimetable(general) {
                /**
                 * var TIMES: All the times for the possible periods
                 * var PERIODS: Period numbers instead of time
                 */
                //TODO: These need to be self populating based off the config
                var TIMES = ["", "9:00-10:00", "10:00-11:00", "11:00-12:00", "12:00-13:00", "13:00-14:00", "14:00-15:00",
                    "15:00-16:00", "16:00-17:00", "17:00-18:00"];
                var PERIODS = ["", "Period 1", "Period 2", "Period 3", "Period 4", "Period 5", "Period 6", "Period 7", "Period 8",
                    "Period 9"];
                var DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

                var WIDTH = 5, HEIGHT = 10;

                //var tbody: What is being added to the page
                var table = '<table id = "room-timetable">\n';

                for (var i = 0; i < HEIGHT; i++) {
                    if (i == 0 && typeof general !== "object") {
                        table += '<tr><th class="cell y-label">Week: ' + (parseInt(weekNumber) + 1) + '</th>';
                    } else {
                        if ($("#view-period").is(":checked")) {
                            table += '<tr><th class="cell y-label">' + PERIODS[i] + '</th>';
                        } else {
                            table += '<tr><th class="cell y-label">' + TIMES[i] + '</th>';
                        }
                    }
                    for (var j = 0; j < WIDTH; j++) {
                        if (i == 0) {
                            table += '<th class="cell x-label">' + DAYS[j] + '</th>';
                        } else {
                            if (typeof general === "object") {
                                specificWeek = false;
                                table += generalInfo(j, i, general);
                            } else {
                                table += weekInfo(j, i);
                            }

                        }
                    }
                    table += '</tr>\n'
                }
                table += '</table>';
                //$this.html(table);
                //console.log($this);
                document.getElementById('timetable-holder').innerHTML = table;

                $($this.find(".period")).each(function () {
                    var $this = $(this),
                        day = $this.attr("data-day"),
                        period = $this.attr("data-period");
                    if (typeof day != "undefined" && typeof period != "undefined") {
                        var weeks = JSON.parse($this.attr("data-weeks"));
                        var $tag = $this.find(".top-list");
                        $($tag).tag();
                        for (var i = 0; i < weeks.length; i++) {
                            var start = Number(weeks[i].start) + 1;
                            var end = Number(weeks[i].end) + 1;
                            $($tag).tag("addTag", start + " - " + end);
                        }
                    }
                });
            }

            /**
             * This is for the overview of all the weeks and when they are free at certain periods
             * @param j : days
             * @param i : periods
             * @param general: the object that contains all the weeks for the periods
             * @returns {string} : the correct td for that period
             */
            function generalInfo(j, i, general) {

                var id = getIdOfPeriod(j, i);

                var info = drawAvailable(general, j, i - 1);

                for (var k = 0; k < timetable.config.numberOfWeeks; k++) {
                    for (var p = 0; p < numberOfRooms; p++) {
                        if (typeof timetable.getWeek(k).getDay(j).getPeriod(i - 1)[p] != "undefined") {
                            if (timetable.getWeek(k).getDay(j).getPeriod(i - 1)[p].getStatus() == "selected") {
                                weekNumber = k;
                                return weekInfo(j, i);
                            }
                        }
                    }
                }
                var table = '<td class =" cell period-holder unselected" id ="' + id + '"><div class="period">' + info + '</div></td>';
                
                return table;
            }

            /**
             * This is for a specific week
             * @param j : day
             * @param i : period
             * @returns {string}
             */
            function weekInfo(j, i) {
                var id = getIdOfPeriod(j, i);
                var info = "";
                var periodVal;

                periodVal = timetable.getWeek(weekNumber).getDay(j).getPeriod(i - 1)[0];

                info = drawSelection(periodVal, j);

                var tempPeriod = timetable.getWeek(weekNumber).getDay(j).getPeriod(i - 1);
                info = displayRooms(info, tempPeriod);

                var periodStatus = getID(periodVal);

                var table = '<td class = "cell period-holder ' + periodStatus + '" id = "' + id + '">' + info + '</td>';

                return table;
            }

            function getIdOfPeriod(j, i) {
                var IDS = ["mo", "tu", "we", "th", "fr"];

                return id = IDS[j] + '-p' + i;
            }

            /**
             *              *
             * @param periodVal : Data on that one period
             * @param day
             * @returns: div containing all the information to be displayed if there is info to display
             */
            function drawSelection(periodVal, day) {

                if (typeof periodVal != "undefined") {
                    if (periodVal.getModule().code != "") {
                        if (periodVal.getStatus() == "selected") {
                            var week = JSON.stringify(periodVal.getWeeks()).replace(/\"/g, '&quot;');
                            var mainDiv = '<div class="period" data-day="' + day + '" data-period="' + parseInt(periodVal.period) + '" data-weeks="' + week + '">' +
                                '<button class="remove">X</button>' +
                                '<div class="edge-list top-list">' +
                                '</div>' +
                                '<div class="period-body">' +
                                '<div class="box-frame">' +
                                '<div class="row">' +
                                '<div class="column"><span class="module-code">' + periodVal.getModule().code + '</span></div>' +
                                '</div>' +
                                '<div class="row">' +
                                '<div class="column"><span class="module-name">' + periodVal.getModule().name + '</span></div>' +
                                '</div>' +
                                '</div>' +
                                '</div>' +
                                '<div class="edge-list bottom-list">' +
                                '</div>' +
                                '</div>';

                            var $mainDiv = $(mainDiv);

                            return $mainDiv;

                        } else {
                            return "Unavailable";
                        }
                    } else {
                        return "";
                    }
                } else {
                    return "";
                }

            }

            /**
             *
             * @param info
             * @param periodVal : values on period
             * @returns {*} : html that wilil display the information on the rooms
             */
            function displayRooms(info, periodVal) {
                if (info != "" && info != "Unavailable") {
                    for (var n = 0; n < numberOfRooms; n++) {
                        for (var k = 0; k < ObjectLength(periodVal[n].getRooms()); k++) {
                            var room = periodVal[n].getRooms()[k];
                            if (room.name != "") {
                                info.find(".bottom-list").append("<span>" + room.name + "</span>");
                            }
                        }
                    }
                    return info.prop("outerHTML");
                }
                return info;
            }

            //Have the ability to switch from seeing the time to seeing the period number on the y-axis
            $("#view-period").unbind("click");
            function initiliaseViewPeriod() {
                $("#view-period").click(function () {
                    $("#timetable-holder").timetableRenderer(timetable, settings);
                });
            }

            initiliaseViewPeriod();

            return {
                render: function (timetable, settings) {

                },
                weekSelectorListener: function () {
                    initialiseWeekListener();
                },
                weekUnavailabilty: function (weekBeg, weekEnd) {
                    getUnavailableWeeks(weekBeg);
                },
                getCurrentTimetable: function () {
                    return timetable;
                }
            };
        };

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

        /**
         * @returns: Just the one week that we are in, in object form
         */
        function getWeeks() {

            var weekBeg = parseInt(weekNumber);
            var weekEnd = parseInt(weekNumber);
            var w = [];
            var weeks = {
                start: weekBeg, end: weekEnd
            };
            w.push(weeks);
            return w;
        }

        /**
         *
         * @param i : which 'period' it is in
         * @returns {{}} : object containg room
         */
        function getRooms(i) {

            //here we get the rooms and input it into an object ready to be stored in the timetable obj

            var chosenRooms = $("input[name='room-list']").val();
            if (typeof chosenRooms != "undefined") {
                chosenRooms = chosenRooms.split(",");
            } else {
                chosenRooms = [""];
            }

            var r = [];
            r[0] = {
                name: chosenRooms[i]
            };
            return r;
        }

        /**
         *
         * @param status : period to extract status from
         * @returns {string} : returns the correct status used in the id
         */
        function getID(status) {
            if (typeof status == "undefined") {
                return "unselected";
            } else {
                return status.getStatus();
            }
        }

        function containsObject(obj, list) {
            for (var i = 0; i < ObjectLength(list); i++) {
                if (list[i].weeks.length != obj.length) {
                    console.log("running");
                    return false;
                }
                for (var j = 0; j < list[i].weeks.length; j++) {
                    if (list[i].weeks[j] != obj[j]) {
                        return false;
                    }
                }
            }
            return true;
        }

        
    }(jQuery)
);
