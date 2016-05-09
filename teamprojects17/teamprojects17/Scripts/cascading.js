$("#parks").change(function () {
    var park = $("#parks").val();
    if (park != 0) {
        updateDropdown("Building", park, "ParkID");
    }
});

$("#building").change(function () {
    var building = $("#building").val();
    if (building != 0) {
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