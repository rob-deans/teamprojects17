$(".header").click(function () {

    $header = $(this);
    $content = $header.next();
    $content.slideToggle(500, function () {
        $header.text(function () {
        });
    });
});

$("#reset-facil").click(function () {
    var roomSQL = "SELECT * FROM Room WHERE 1=1";
    sendData(roomSQL);
});

//Is there somthing wrong with this as nothing outputs to debug?!?!
$('#submit-facil').click(function () {
    //This will be the list of checked facilities
    var checked = [];
    $("input[name='view-period']:checked").each(function ()
    {
        checked.push(parseInt($(this).val()));
    });
    var roomSQL = "SELECT * FROM Room WHERE 1=1";
    //Can't grab values?
    var park = $('#parks').val();
    var building = $('#building').val();
    var capacitymin= $('filterMinCapacity').val();
    var capacitymax = $('filterMaxCapacity').val();

    
    if(building != 'all'){
        roomSQL+=" AND BuildingCode='"+building+"'";
    }
    else if(park != 'all'){
        roomSQL+=" AND BuildingCode IN (Select BuildingCode FROM Building WHERE ParkID ="+park+") "; 
    }
    if(typeof capacitymin != "undefined"){
        roomSQL+=" AND Capacity > "+capacitymin;
    }
    if(typeof capacitymax != "undefined"){
        roomSQL+=" AND Capacity < "+capacitymax;
    }
    
    
    roomSQL+=" AND RoomCode IN (SELECT RoomCode From FacilityRoom WHERE 1=1";
    var i;
    for (i = 0; i < checked.length; ++i) {
        roomSQL += " AND RoomCode IN (Select RoomCode From FacilityRoom WHERE FacilityID ="+checked[i]+")";
    }
    roomSQL +=")"
    console.log(roomSQL);
    
    sendData(roomSQL);

});

function sendData(roomSQL) {
    $.ajax({
        type: "POST",
        url: "getRoomStuff",
        data: {
            SQLQ: roomSQL
        },
        success: function (data) {
            displayTable(data);
        }
    })
}

function displayTable(data) {
    document.getElementById('room-holder').innerHTML = "";
    var tableBeg = '<tr>'+
                '<td align="center" style="font-weight:bold" width="20%"> Name </td>'+
                '<td align="center" style="font-weight:bold" width="20%"> Park </td>'+
                '<td align="center" style="font-weight:bold" width="20%"> Building </td>'+
                '<td align="center" style="font-weight:bold" width="20%"> Capacity </td>'+
                '<td align="center" style="font-weight:bold" width="20%"> Facilities </td>'+
            '</tr>';
    $(".modules-table").append(tableBeg);
    for (var i = 0; i < data.length; i++) {
        var table = '<tr><td align="center">' + data[i].RoomCode + '</td>' +
                    '<td align="center">'+ data[i].ParkName + '</td>' +
                    '<td align="center">' + data[i].BuildingCode + '</td>' +
                    '<td align="center">' + data[i].Capacity + '</td>' +
                    '<td align="center" >';
        for (var j = 0; j < data[i].FacilityName.length; j++) {
            var fac = data[i].FacilityName[j].replace(/_/g, " ");
            table += fac + '<br />';
        }
        table += '</td></tr>';

        $(".modules-table").append(table);
        
    }
    var tableEnd = "</table>";
    
    $(".modules-table").append(tableEnd);
}