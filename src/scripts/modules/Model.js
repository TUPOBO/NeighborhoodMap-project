// The Model
var $ =require('jquery');
var ko = require('knockout');

var Model = function() {

    var Location = function(data) {

        var self = this;
    
        self.name = data.name;
        self.lat = data.lat;
        self.lng = data.lng;
    
        var largeInfoWindow = new google.maps.InfoWindow();
    
        var defaultIcon = makeMarkerIcon('aa5355');
        var highlightedIcon = makeMarkerIcon('53aaa8');
    
        // create a new marker
        this.marker = new google.maps.Marker({
            position: new google.maps.LatLng(data.lat, data.lng),
            title: data.name,
            map: map,
            icon: defaultIcon,
            animation: google.maps.Animation.DROP
        });
    
        // when the marker is clicked, get the API info and show it and bounce the marker
        this.marker.addListener('click', function() {
            self.bounce();
        });
    
        // change the color of the marker when hovering on the marker
        this.marker.addListener('mouseover', function() {
            self.marker.setIcon(highlightedIcon);
        });
    
    
        // change the color of the marker to default
        this.marker.addListener('mouseout', function() {
            self.marker.setIcon(defaultIcon);
        });
    
        // display the infoWindow with wikipedia information
        function populateInfoWindow(marker, infoWindow) {
            if (infoWindow.marker != marker) {
                infoWindow.marker = marker;
            }
    
            var wikiApiUrl = 'https://en.wikipedia.org/w/api.php?action=opensearch&format=json&search='+marker.title+'&limit=20&callback=wikiCallback';
    
            $.ajax({
                url: wikiApiUrl,
                dataType: 'jsonp'
            }).done(function(response) {
                var link = response[3][0];
                var description = response[2][0];
                infoWindow.setContent('<h5>'+marker.title+'</h5>'+'<p>'+description+'</p>'+'<a href="'+link+'" target="blank" style="display:block;">Click here for more information</a>');
                infoWindow.open(map, marker);
            }).fail(function() {
                alert("An error must have occured loading the information from wikipedia.");
            });
        }
    
        // create the marker image 
        function makeMarkerIcon(markerColor) {
            var markerImage = new google.maps.MarkerImage(
                'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|'+ markerColor +'|40|_|%E2%80%A2',
                new google.maps.Size(25,40),
                new google.maps.Point(0,0),
                new google.maps.Point(10,34),
                new google.maps.Size(25,40));
            return markerImage;
        }
    
        // animate the marker and then stop the animation after 1400ms
        this.bounce = function(loc) {
            self.marker.setAnimation(google.maps.Animation.BOUNCE);
            setTimeout(function(){ self.marker.setAnimation(null); }, 1400);
            populateInfoWindow(self.marker, largeInfoWindow);
        };
    
    };
};


module.exports = Model;