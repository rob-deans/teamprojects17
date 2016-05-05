﻿var weekBeg = 1;
var weekEnd = 12;

$(document).ready(function () {
    var timetable = new Timetable(1);
    var timetableRenderer = $("#timetable-holder").timetableRenderer(timetable, { type: "general" });
    weekEnd = timetable.config.numberOfWeeks;
    selectWeekRange(timetableRenderer);

    $("#parks").change(function () {
        var park = $("#parks").val();
        if(park != 0) {
            updateDropdown("Building", park, "ParkID");
        }
    });

    $("#building").change(function () {
        var building = $("#building").val();
        if(building != 0) {
            updateDropdown("Room", building, "BuildingCode");
        }
    });

    function updateDropdown(table, id, column) {
        $.ajax({
            type: "POST",
            url: "Timetable/updateDropDown",
            data: {
                table: table,
                id: id,
                column: column
            },
            success: function (data) {
                if (table == "Room") {
                    $dropdown = $("#rooms");
                    $dropdown.empty();
                    $.each(data, function (value, key) {
                        $dropdown.append($("<option></option>")
                            .attr("value", key.RoomCode)
                            .text(key.RoomCode));
                    });
                } else {
                    $dropdown = $("#building");
                    $dropdown.empty();
                    $.each(data, function (value, key) {
                        $dropdown.append($("<option></option>")
                            .attr("value", key.BuildingCode)
                            .text(key.BuildingName));
                    });
                }
            }                
        });
    }

    $("#module-code").change(function () {
        $this = $("#module-code");
        if ($this.val() != 0) {
            getModule($this.val(), true);
        }
    });

    $("#module-name").change(function () {
        $this = $("#module-name");
        if ($this.val() != 0){
            getModule($this.val(), false);
        }
    });

    function getModule(val, b) {
        $.ajax({
            type: "POST",
            url: "Timetable/getModule",
            data: {
                val: val,
                b: b
            },
            success: function (data) {
                if (!b) {
                    $("#module-code").val(data);
                } else {
                    $("#module-name").val(data);
                }
            }
        });
    }

    $("#rooms-list").tag({ inputName: "room-list", maximum: 4 });
    $("#rooms-list").bind("DOMSubtreeModified", function () {
        displayUpdatedTimetable();
    });

    function displayUpdatedTimetable() {
        var data = refreshData($("#room-list").val().split(","));
        var t = new Timetable(1);
        console.log(data);
        t.populate(data);
        timetableRenderer = $("#timetable-holder").timetableRenderer(t, { type: "general" });
        selectWeekRange(timetableRenderer);
    }

    function refreshData(rooms) {
        var tt = {};
        $.ajax({
            type : "POST", 
            url: "Timetable/getTimetable",
            data: {
                rooms: rooms
            },
            success: function (data) {
                tt = data;
            },
            error: function (data) {
                console.error(data);
            }
        });
        return tt;
    }

    $("#add-room").click(function (e) {
        e.preventDefault();
        var $this = $(this);
        var $list = $("#rooms-list");
        if ($("#rooms").val() != 0) {
            $list.tag("addTag", $("#rooms").val());
            if ($list.children().length - 1 > $("#number-of-rooms").val()) {
                $("#number-of-rooms").val(function (i, value) {
                    return $list.children().length - 1;
                });
            }
        }
    });

    $("#submit-choices").click(function () {
        console.log("running");
        $.ajax({
            type: "POST",
            url: "Timetable/setTimetable",
            data: {
                timetable: JSON.stringify(timetableRenderer.getCurrentTimetable())
            },
            success: function (data) {
                var t = new Timetable(1);
                timetableRenderer = $("#timetable-holder").timetableRenderer(t, { type: "general" });
                displayUpdatedTimetable();
                selectWeekRange(timetableRenderer);
            }
        });
    });

    $("#range-selector").click(function () {
        selectWeekRange(timetableRenderer);
    });

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


});

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