
var calcRoute;
var initialize;
var codeAddress;

var directionsDisplay = new google.maps.DirectionsRenderer();
var directionsService = new google.maps.DirectionsService();
var geocoder = new google.maps.Geocoder();
var map;

var start;
var end;
    
initialize = function(sAddress,eAddress) {

    var mapOptions = {
        zoom: 18,
        center: new google.maps.LatLng(40.717975, -74.014037)
    }

    map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
    directionsDisplay.setMap(map);
    directionsDisplay.setPanel(document.getElementById("directions-panel"));

    codeAddress(sAddress,eAddress)

}

codeAddress = function(sAddress,eAddress) {
    geocoder.geocode({ 'address': sAddress}, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
        	start = results[0].geometry.location;
        	map.setCenter(results[0].geometry.location);
        }
        else {
        	alert("Geocode was unsuccessful because: " + status);
            return null;
        }
    }     
                    );
    geocoder.geocode( { 'address': eAddress}, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            if (results[0]){ 
                end = results[0].geometry.location;
                if(document.getElementById("directions-panel") != null)
                    calcRoute();
            }
        }
        else {
            alert("Geocode was not successful because: " + status);
        }
    }
                    );      
} 

    
calcRoute = function() {
   /*  
    var mode = document.getElementById("mode"); 
    var selectedMode;
    if(mode == null)
       selectedMode = "WALKING";
    else
        selectedMode = mode.value;
    */
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

/*
var toggleMaps = function(){
    var maps = document.getElementById("maps-wrapper"); 
    if(maps.style.height == '0%'){
        maps.style.height = '100%';
        google.maps.event.trigger(map, 'resize');
        calcRoute();
    }
    else
        maps.style.height = '0%';
}

*/
