

var directionsDisplay = new google.maps.DirectionsRenderer({ suppressMarkers: true, preserveViewport: true});
var directionsService = new google.maps.DirectionsService();
var geocoder = new google.maps.Geocoder();
var map;

//var start;
//var end;
var venues = [];
var iw_contents = [];
var start_pos = null;

var init_events = function(start_loc, p_venues) {

//var start_pos = {{starting_location}}
start_pos = [start_loc, "This is your location!"];
//var start_pos = [ "320 chambers street, new york, ny" , "This is your location!"];

//passed_venues should be a 2D array.
//passed_venues[i][0] should be the location in string form
//passed_venues[i][1] should be information about the location as a string of appropriate html tags


//var p_venues = {{passed_venues}};

for(var i = 0; i < p_venues.length; i++){
    iw = "<div class='info_windows'>" + 
         "<h4>" + p_venues[i][1] + "</h4>" + 
         "<img alt='no available image' src='" + p_venues[i][2] + 
            "' height='12px' width='12px'>" + 
         "<p class='snippetxt'>" + p_venues[i][3] + "</p>" + 
         "<a onclick='getDirections()'>Calculate directions to here</a>" +
         "</div>";
    venues.push( [p_venues[i][0], iw] )
}


//var temp_iw = "<div class='info_windows'>" + 
//              "<h4>temporary info window</h4>" + 
//              "<p>this is a placeholder for pop-up information about the venues</p>" + 
//              "<a onclick='getDirections()'>Calculate directions to here</a>" +
//              "</div>";
//
//var venues = [
//    ["345 chambers street, new york, ny",temp_iw],
//    ["300 duane street, new york, ny",temp_iw],
//    ["250 warren street, new york, ny",temp_iw]
//    ];


}

var initialize = function(cntr){
//    if(cntr){
        codeAddress(cntr, function(loc){
            //console.log("loc: " + loc);
            var mapOptions = {
                zoom: 17,
                center: loc
            } 

            map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
            directionsDisplay.setMap(map);
            directionsDisplay.setPanel(document.getElementById("directions-panel"));
        
            events_init();

            add_marker(loc, start_pos[1], 'green');
            place_markers();
            }
        );
/*
    } else {
        
            var mapOptions = {
                zoom: 17,
                center: new google.maps.LatLng(40.7183, 74.0142)
            } 
        map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
        directionsDisplay.setMap(map);
        directionsDisplay.setPanel(document.getElementById("directions-panel"));
    }
*/
}


var codeAddress = function(address, callback) {
    geocoder.geocode(
        { 'address': address}, function(results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                //console.log(results[0].geometry.location);
                callback(results[0].geometry.location);
            }
            else {
            	alert("geocode was unsuccessful because: " + status);
                return null;
            }
        }     
    );
} 
    
var calcRoute = function(start,end) {
    var selectedMode = document.getElementById("mode").value;
    
    var request = {
        origin: start,
        destination: end,
        travelMode: google.maps.TravelMode[selectedMode]
    };

    directionsService.route(request, function(response, status) {
        if (status == google.maps.DirectionsStatus.OK) {
            directionsDisplay.setDirections(response);
        }
        else{
        	alert("error displaying directions");
    	}
    }
                            );
}

var getDirections = function(){
    var marker_id = 0;
    while(opened_info_window != info_windows[marker_id])
        marker_id++;
    console.log(marker_id);
    console.log(venues_locs[0]);
    calcRoute(markers[0].getPosition(), markers[marker_id].getPosition());
}


var markers = [];
var venues_locs = [];



var place_markers = function(){
    var counter = venues.length;
    for(var i = 0; i < venues.length; i++){
        codeAddress(venues[i][0], 
            function(loc){
                venues_locs.push(loc);
                counter--;
                if(counter == 0)
                    drop_markers();
            }
        );
    }
}


var drop_markers = function(){
    for (var i = 0; i < venues_locs.length; i++){
        //setTimeout(function() {
            add_marker(venues_locs[i], temp_iw, 'red');
        //}, i * 200);
    }
    return markers.length;
}

var opened_info_window = null;
var info_windows = [];

var add_marker = function(pos,info,color){
    var url;
    if(color == 'red')
        url = null;//"http://maps.google.com/mapfiles/ms/icons/red-dot.png";
    else if(color == 'green')
        url = "http://maps.google.com/mapfiles/ms/icons/green-dot.png"; 
    else if(color == 'blue')
        url = "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"; 
    else if(color == 'purple')
        url = "http://maps.google.com/mapfiles/ms/icons/purple-dot.png";
    else if(color == 'yellow')
        url = "http://maps.google.com/mapfiles/ms/icons/yellow-dot.png";

    var newMark = new google.maps.Marker(
        {
            position: pos,
            map: map,
            draggable: false,
            animation: google.maps.Animation.DROP,
            icon: url
        });

    var infowindow = new google.maps.InfoWindow({
        content: info
    });
    
    info_windows.push(infowindow);
    
    google.maps.event.addListener(newMark, 'click',function(){
        if(opened_info_window != null)
            opened_info_window.close();
        opened_info_window = infowindow;
        infowindow.open(map,newMark);
    });
    markers.push(newMark)
}


//----------------------------------
//end of google maps related script
//---------------------------------


var toggleMaps = function(){
    var maps = document.getElementById("maps-wrapper"); 
    if(maps.style.display == 'none'){
        maps.style.display = 'block';
        google.maps.event.trigger(map, 'resize');
        calcRoute();
    }
    else
        maps.style.display = 'none';
}

google.maps.event.addDomListener(window,'load',
    function(){
        console.log("1 2 3 ");
        console.log(p_v);
        init_events(s_loc, p_v);
        initialize(s_loc);
        drop_markers();
    }
);
