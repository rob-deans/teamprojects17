$(".header").click(function () {

    $header = $(this);
    $content = $header.next();
    $content.slideToggle(500, function () {
        $header.text(function () {
        });
    });
});


//Is there somthing wrong with this as nothing outputs to debug?!?!
$('#submit-facil').click(function () {
    document.getElementById('room-holder').innerHTML = "";
    console.log("hello");
    //This will be the list of checked facilities
    var checked = [];
    $("input[name='view-period']:checked").each(function ()
    {
        checked.push(parseInt($(this).val()));
    });
    console.log(checked[0]);
    var SQL1 = "SELECT * FROM Room where TRUE";
    //Can't grab values?
    var park = $('#filterpark').val();
    var building = $('#filtertype').val();
    var capacitymin= $('filterMinCapacity').val();
    var capacitymax = $('filterMaxCapacity').val();

    
    if(building != 'all'){
        SQL1+=" AND BuildingCode="+building;
    }
    else if(park != 'all'){
        SQL1+=" AND BuildingCode IN (Select BuildingCode FROM Building WHERE PARK ="+park+" "; 
    }
    if(typeof capacitymin != "undefined"){
        SQL1+=" AND Capacity > "+capacitymin;
    }
    if(typeof capacitymax != "undefined"){
        SQL1+=" AND Capacity < "+capacitymax;
    }
    
    
    SQL1+=" AND RoomCode IN (SELECT RoomCode From FacilityRoom where TRUE";
    var i;
    for (i = 0; i < checked.length; ++i) {
        SQL1 += " AND RoomCode IN (Select RoomCode From FacilityRoom Where FacilityID =="+checked[i]+")";
    }
    SQL1 +=")"
    //pass SQL??
    console.log(SQL1);
    $.ajax({
            type: "POST",
            url: " /getRoomStuff",
            data: {
                SQLQ:SQL1
            },
            success: function (data) {
                console.log(data);
            }
        })


});

$("#submit-choices").click(function () {
    console.log("running");
    
})