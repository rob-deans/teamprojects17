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
    Debug.write("hello");
    //This will be the list of checked facilities
    var checked = [];
    $("input[name='view-period']:checked").each(function ()
    {
        checked.push(parseInt($(this).val()));
    });
    Debug.write(checked.length);
    var SQL1 = "SELECT * FROM Room where TRUE";
    //Can't grab values?
    var park= $('#filterpark').val();
    var building= document.getElementById('filterbuilding').val();
    var capacitymin= document.getElementById('filterMinCapacity').val();
    var capacitymax = document.getElementById('filterMaxCapacity').val();

    /*
    if(Building not empty){
        SQL1+=" AND BuildingCode="+building;
    }
    else if(park not empty){
        SQL1+=" AND BuildingCode IN (Select BuildingCode FROM Building WHERE PARK ="+park; 
    }
    if(capacitymin not empty){
        SQL1+=" AND Capacity > "+capacitymin;
    }
    if(capacitymax not empty){
        SQL1+=" AND Capacity < "+capacitymax;
    }
    
    
    SQL1+="AND RoomCode IN (SELECT RoomCode From FacilityRoom where TRUE";
    var i;
    for (i = 0; i < checked.length; ++i) {
        SQL1 += "AND RoomCode IN (Select RoomCode From FacilityRoom Where FacilityID =="+checked[i]+")";
    }
    
    pass SQL??
    */
    Debug.write(park+" "+capacitymax);
});
