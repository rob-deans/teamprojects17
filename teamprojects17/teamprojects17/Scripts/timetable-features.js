var weekBeg = 1;
var weekEnd = 12;

$(document).ready(function () {
    var timetable = new Timetable(1);
    var timetableRenderer = $("#timetable-holder").timetableRenderer(timetable, { type: "general" });
    weekEnd = timetable.config.numberOfWeeks;
    selectWeekRange(timetableRenderer);

    

    //$("#rooms-list").tag({ inputName: "room-list", maximum: 4 });
    //$("#rooms-list").bind("DOMSubtreeModified", function () {
    //    var data = refreshData($("#room-list").val().split(","));
    //    var t = new Timetable(data.semester);
    //    t.populate(data);
    //    timetableRenderer = $("#timetable-holder").timetableRenderer(t, { type: "general" });
    //    selectWeekRange(timetableRenderer);
    //});

    //$("#add-room").click(function (e) {
    //    e.preventDefault();
    //    var $this = $(this);
    //    var $list = $("#rooms-list");
    //    if ($("#rooms").val() != 0) {
    //        $list.tag("addTag", $("#rooms").val());
    //        if ($list.children().length - 1 > $("#number-of-rooms").val()) {
    //            $("#number-of-rooms").val(function (i, value) {
    //                console.log("running");
    //                return $list.children().length - 1;
    //            });
    //        }
    //    }
    //});

    //$("#requirements").tag({
    //    inputName: "special-requirements"
    //});

    //$("#special-requirements").keypress(function (e) {
    //    if (e.which == 13) {
    //        $this = $(this);
    //        console.log($("#special-requirements"));
    //        $("#requirements").tag("addTag", $this.val());
    //        $this.val("");
    //        e.preventDefault();
    //    }
    //});

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