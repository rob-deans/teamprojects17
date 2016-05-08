var weekBeg = 1;
var weekEnd = 15;

function setSliderText() {
    if (weekBeg != weekEnd) {	//if the values are the same dont show 'Weeks x - x' show 'Week x'
        $("#week-chosen").text("Week: " + weekBeg + " to Week: " + weekEnd);
    }
    else {
        $("#week-chosen").text("Week: " + weekBeg);
    }
}

function selectWeekRange(renderer) {
    var $weekRange = $(".weekRange").addClass("tag-list");
    $weekRange.tag({
        atLeastOne: true,
        data: { 'data-beg': weekBeg, 'data-end': weekEnd },
        inputName: 'week-range',
        removeable: true
    });

    $weekRange.tag("addTag", weekBeg + " - " + weekEnd);

    if (renderer) {
        renderer.weekSelectorListener();
        renderer.weekUnavailabilty(weekBeg, weekEnd);
    }
}
function initliaseSlider() {
    $("#weeks-selected").slider({
        range: true,
        min: 1,
        max: weekEnd,
        values: [1, weekEnd],
        slide: function (event, ui) {
            weekBeg = ui.values[0];
            weekEnd = ui.values[1];
            setSliderText();
        }
    });

    //set the value straight away
    $("#week-chosen").text("Week: " + $("#weeks-selected").slider("values", 0) +
        " to Week: " + $("#weeks-selected").slider("values", 1));

    var $wr = $("#weeks-range");

    for (var i = 0; i < 15; i++) {
        $wr.append("<div class='week-selector' data-week='" + (i) + "'>" +
            "Week " + (i + 1) + "</div>");
    }
}

function initiliaseSubmit(timetableRenderer) {
    $("#submit-choices").click(function () {
        console.log("running");
        $.ajax({
            type: "POST",
            url: "Timetable/setTimetable",
            data: {
                timetable: JSON.stringify(timetableRenderer.getCurrentTimetable()),
                parkID: 1,
                buildingCode: "JB"
            },
            success: function (data) {
                var t = new Timetable(1);
                timetableRenderer = $("#timetable-holder").timetableRenderer(t, { type: "general" });
                selectWeekRange(timetableRenderer);
            }
        });
    });
}

function initiliaseRange(timetableRenderer) {
    $("#range-selector").click(function () {
        selectWeekRange(timetableRenderer);
    });
}

function displayUpdatedTimetable() {
    var data = refreshData($("#room-list").val().split(","));
}

function continueDisplay(data) {
    var t = new Timetable(1);
    t.populate(data);
    timetableRenderer = $("#timetable-holder").timetableRenderer(t, { type: "general" });
    selectWeekRange(timetableRenderer);
}

function refreshData(rooms) {
    var tt = {};
    console.log(rooms);
    if (rooms[0] != "") {
        $.ajax({
            type: "POST",
            url: "Timetable/getTimetable",
            data: {
                rooms: rooms
            },
            success: function (data) {
                tt = data;
                console.log(tt);
                continueDisplay(tt);
                return data;
            },
            error: function (data) {
                console.error(data);
            }
        });
    } else {
        return new Timetable(1);
    }
}