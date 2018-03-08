var $ = require('jquery');
var ko = require('knockout');
var initLocations = [
    {
        name: "Central Roast",
        lat: 44.648684,
        lng: -124.052467,
    },
    {
        name: "Dutch Bros. Coffee",
        lat: 44.62933649650506,
        lng: -124.06172633171082,
    },
    {
        name: "The Coffee House",
        lat: 44.631362557411194,
        lng: -124.050916,
    },
    {
        name: "Starbucks",
        lat: 44.63738090498442,
        lng: -124.05263566533459,
        id: "4bafb4d1f964a52080193ce3"
    },
    {
        name: "Starbucks",
        lat: 44.651158892548324,
        lng: -124.0517664026574,
        id: "4e4dd567bd41b76bef93e4a9"
    }
];
var map;
var bounds;

// map styles from snazzymaps.com
var styles = [{
        "featureType": "all",
        "elementType": "geometry.fill",
        "stylers": [{
            "weight": "2.00"
        }]
    },
    {
        "featureType": "all",
        "elementType": "geometry.stroke",
        "stylers": [{
            "color": "#9c9c9c"
        }]
    },
    {
        "featureType": "all",
        "elementType": "labels.text",
        "stylers": [{
            "visibility": "on"
        }]
    },
    {
        "featureType": "landscape",
        "elementType": "all",
        "stylers": [{
            "color": "#f2f2f2"
        }]
    },
    {
        "featureType": "landscape",
        "elementType": "geometry.fill",
        "stylers": [{
            "color": "#ffffff"
        }]
    },
    {
        "featureType": "landscape.man_made",
        "elementType": "geometry.fill",
        "stylers": [{
            "color": "#ffffff"
        }]
    },
    {
        "featureType": "poi",
        "elementType": "all",
        "stylers": [{
            "visibility": "off"
        }]
    },
    {
        "featureType": "road",
        "elementType": "all",
        "stylers": [{
                "saturation": -100
            },
            {
                "lightness": 45
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "geometry.fill",
        "stylers": [{
            "color": "#eeeeee"
        }]
    },
    {
        "featureType": "road",
        "elementType": "labels.text.fill",
        "stylers": [{
            "color": "#7b7b7b"
        }]
    },
    {
        "featureType": "road",
        "elementType": "labels.text.stroke",
        "stylers": [{
            "color": "#ffffff"
        }]
    },
    {
        "featureType": "road.highway",
        "elementType": "all",
        "stylers": [{
            "visibility": "simplified"
        }]
    },
    {
        "featureType": "road.arterial",
        "elementType": "labels.icon",
        "stylers": [{
            "visibility": "off"
        }]
    },
    {
        "featureType": "transit",
        "elementType": "all",
        "stylers": [{
            "visibility": "off"
        }]
    },
    {
        "featureType": "water",
        "elementType": "all",
        "stylers": [{
                "color": "#46bcec"
            },
            {
                "visibility": "on"
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "geometry.fill",
        "stylers": [{
            "color": "#c8d7d4"
        }]
    },
    {
        "featureType": "water",
        "elementType": "labels.text.fill",
        "stylers": [{
            "color": "#070707"
        }]
    },
    {
        "featureType": "water",
        "elementType": "labels.text.stroke",
        "stylers": [{
            "color": "#ffffff"
        }]
    }
]

// The Model
var Location = function (data) {

    var self = this;

    self.name = data.name;
    self.lat = data.lat;
    self.lng = data.lng;

    var largeInfoWindow = new google.maps.InfoWindow();

    var defaultIcon = makeMarkerIcon('fcfcfc');
    var highlightedIcon = makeMarkerIcon('cfcfcf');

    // 创建标记
    this.marker = new google.maps.Marker({
        position: new google.maps.LatLng(data.lat, data.lng),
        title: data.name,
        map: map,
        icon: defaultIcon,
        animation: google.maps.Animation.DROP
    });

    // when the marker is clicked, get the API info and show it and bounce the marker 点击标记，出现信息窗口
    this.marker.addListener('click', function () {
        self.bounce();
    });

    // 当鼠标滑过标记时，改变标记颜色
    this.marker.addListener('mouseover', function () {
        self.marker.setIcon(highlightedIcon);
    });


    // 鼠标离开标记，标记恢复默认颜色
    this.marker.addListener('mouseout', function () {
        self.marker.setIcon(defaultIcon);
    });

    // 利用Wiki API 作为信息窗口内的信息
    function populateInfoWindow(marker, infoWindow) {
        if (infoWindow.marker != marker) {
            infoWindow.marker = marker;
        }

        var wikiApiUrl = 'https://en.wikipedia.org/w/api.php?action=opensearch&format=json&search=' + marker.title + '&limit=20&callback=wikiCallback';

        $.ajax({
            url: wikiApiUrl,
            dataType: 'jsonp'
        }).done(function (response) {
            var link = response[3][0];
            var description = response[2][0];
            infoWindow.setContent('<h5>' + marker.title + '</h5>' + '<p>' + description + '</p>' + '<a href="' + link + '" target="blank" style="display:block;">Click here for more information</a>');
            infoWindow.open(map, marker);
        }).fail(function () {
            alert("An error must have occured loading the information from wikipedia.");
        });
    }

    // create the marker image 
    function makeMarkerIcon(markerColor) {
        var markerImage = new google.maps.MarkerImage(
            'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|' + markerColor + '|40|_|%E2%80%A2',
            new google.maps.Size(25, 40),
            new google.maps.Point(0, 0),
            new google.maps.Point(10, 34),
            new google.maps.Size(25, 40));
        return markerImage;
    }

    // 使用标记动画，并1400ms后停止
    this.bounce = function (loc) {
        self.marker.setAnimation(google.maps.Animation.BOUNCE);
        setTimeout(function () {
            self.marker.setAnimation(null);
        }, 1400);
        populateInfoWindow(self.marker, largeInfoWindow);
    };

};


// The ViewModel 
var ViewModel = function () {

    var self = this;

    this.locations = ko.observableArray([]);

    this.query = ko.observable('');
    
    //默认不显示地点列表
    this.isShowLocList = ko.observable('true');
    
    // 点击+按钮显示地点列表
    this.toggleLocList =function() {
        this.isShowLocList(!this.isShowLocList());
    }

    //创建地图
    map = new google.maps.Map(document.getElementById('map'), {
        center: {
            lat: 44.635371,
            lng: -124.053291
        },
        zoom: 14,
        styles: styles,
        mapTypeControl: false,
        fullscreenControl: true,
        fullscreenControlOptions: {
            position: google.maps.ControlPosition.RIGHT_BOTTOM
        }
    });

    // 将地点数字设为observable array
    initLocations.forEach(function (loc) {
        self.locations.push(new Location(loc));
    });

    // 把信息窗口绑定到各自的标记
    bounds = new google.maps.LatLngBounds();
    initLocations.forEach(function (loc) {
        position = {
            lat: loc.lat,
            lng: loc.lng
        };
        bounds.extend(position);
    });
    map.fitBounds(bounds);

    // 搜索栏筛选地点
    this.filteredLocs = ko.computed(function () {
        return this.locations().filter(function (loc) {
            
            loc.marker.setMap(null);
            if (loc.name.toLowerCase().indexOf(self.query().toLowerCase()) >= 0) {
                
                loc.marker.setMap(map);
                
                return loc.name;
            }
        });
    }, this);

};

// 错误提示
function mapErrorHandling() {
	alert("An error must have occured loading the map. Please check your internet connection and try again.");
}

window.initMap = function () {
    ko.applyBindings(new ViewModel());
};