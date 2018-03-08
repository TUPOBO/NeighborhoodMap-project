var $ = require('jquery');
var ko = require('knockout');
// require('./Location');
require('./MapStyles');
// require('./Model');
var defaultLocation = [
    {
        name: "合肥",
        lat: 117.282699,
        lng: 31.866942
    },
    {
        name: "连云港",
        lat: 119.173872,
        lng: 34.601549
    },
    {
        name: "上海",
        lat: 121.487899,
        lng: 31.249162
    },
    {
        name: "无锡",
        lat: 120.305456,
        lng: 31.570037
    },
    {
        name: "泰州",
        lat: 119.919606,
        lng: 32.476053
    },
    {
        name: "南京",
        lat: 118.778074,
        lng: 32.057236
    },
];

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

// The ViewModel 
var map;
var bounds;

var ViewModel = function () {

    var self = this;

    this.locations = ko.observableArray([]);

    this.query = ko.observable('');

    this.isShowLocList = ko.observable(false);

    this.toggleLocList=function() {
        self.isShowLocList(!self.isShowLocList());
    }

    //create the map
    map = new google.maps.Map(document.getElementById('map'), {
        center: {
            lat: 117.282699,
            lng: 31.866942
        },
        zoom: 17,
        // styles: styles,
        mapTypeControl: false,
        fullscreenControl: true,
        fullscreenControlOptions: {
            position: google.maps.ControlPosition.RIGHT_BOTTOM
        }
    });

    // push the defined locations to the observable array
    for (let loc in defaultLocation) {
        self.locations.push(new Location(loc));
        console.log(self.locations);
    }
    defaultLocation.forEach(function (loc) {
        self.locations.push(new Location(loc));
    });

    // set the bounds of the map according to the position of the markers
    bounds = new google.maps.LatLngBounds();
    for (let loc in defaultLocation) {
        position = {
            lat: loc.lat,
            lng: loc.lng
        };
        bounds.extend(position); 
    }
    // defaultLocation.forEach(function (loc) {
    //     position = {
    //         lat: loc.lat,
    //         lng: loc.lng
    //     };
    //     bounds.extend(position);
    // });
    map.fitBounds(bounds);

    // filter the input search results
    this.filteredLocs = ko.computed(function () {
        return this.locations().filter(function (loc) {
            // clear the map from the markers
            loc.marker.setMap(null);
            if (loc.name.toLowerCase().indexOf(self.query().toLowerCase()) >= 0) {
                // set the location's marker on the map
                loc.marker.setMap(map);
                // show the location name on the list
                return loc.name;
            }
        });
    }, this);





};
function mapErrorHandling() {
    alert("An error must have occured loading the map. Please check your internet connection and try again.");
}

window.initMap = function() {
	ko.applyBindings(new ViewModel());
};


module.exports = ViewModel;