

var directionsDisplay = new google.maps.DirectionsRenderer();
var directionsService = new google.maps.DirectionsService();
var geocoder = new google.maps.Geocoder();
var map;

var start;
var end;

//var start_loc = {{starting_location}}
var start_loc = ["325 chambers street, new york, ny", "message"]

//passed_venues should be a 2D array.
//passed_venues[i][0] should be the location in string form
//passed_venues[i][1] should be information about the location as a string of appropriate html tags
//var venues = {{passed_venues}};
var temp_iw = "<div class='info_windows'>" + 
              "<h4>temporary info window</h4>" + 
              "<p>this is a placeholder for pop-up information about the venues"; + 
              "</div>"
var venues = [
    ["345 chambers street, new york, ny",temp_iw],
    ["300 duane street, new york, ny",temp_iw],
    ["250 warren street, new york, ny",temp_iw]
    ];

var initialize = function(cntr) {
    codeaddress_2(cntr, function(loc){
        //console.log("loc: " + loc);
        var mapOptions = {
            zoom: 17,
            center: loc
        } 

        map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
        directionsDisplay.setMap(map);
        directionsDisplay.setPanel(document.getElementById("directions-panel"));
        add_marker(loc, start_loc[1], 'green');

        }
    );
}

var codeAddress = function(saddress,eaddress) {
    geocoder.geocode({ 'address': saddress}, function(results, status) {
        if (status == google.maps.geocoderstatus.ok) {
        	start = results[0].geometry.location;
        	map.setcenter(results[0].geometry.location);
        }
        else {
        	alert("geocode was unsuccessful because: " + status);
            return null;
        }
    }     
                    );
    geocoder.geocode( { 'address': eaddress}, function(results, status) {
        if (status == google.maps.geocoderstatus.ok) {
            if (results[0]){ 
                end = results[0].geometry.location;
                calcRoute();
            }
        }
        else {
            alert("geocode was not successful because: " + status);
        }
    }
                    );      
} 

var codeaddress_2 = function(address, cb_func) {
    geocoder.geocode(
        { 'address': address}, function(results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                //console.log(results[0].geometry.location);
                cb_func(results[0].geometry.location);
            }
            else {
            	alert("geocode was unsuccessful because: " + status);
                return null;
            }
        }     
    );
} 
    
var calcRoute = function() {
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


var markers = [];
var venues_locs = [];



var place_markers = function(callback){
    var counter = venues.length;
    for(var i = 0; i < venues.length; i++){
        codeaddress_2(venues[i][0], 
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

    newMark = new google.maps.Marker(
        {
            position: pos,
            map: map,
            draggable: false,
            animation: google.maps.Animation.DROP,
            icon: url
        })
    var infowindow = new google.maps.InfoWindow({
        content: info
    });

    google.maps.event.addListener(newMark, 'click',function(){
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
        initialize(start_loc[0]);
        place_markers();
    }
);


