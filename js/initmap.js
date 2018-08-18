// Set global variables.
var  map;
var  infoWindow;
var  locationsNuernberg = [
  {
    title: "Blumenstraße, Nürnberg",
    location: {lat:49.4496233, lng:11.087262499999952},
    label: "1"
  },
  {
    title: 'Nürnberg Hauptbahnhof',
    location: {lat:49.4455822, lng:11.082531700000004},
    label: "2"
  },
  {
    title: 'Cinecittà Nürnberg',
    location: {lat:49.4520523, lng:11.083248799999978},
    label: "3"
  },
  {
    title: 'DATEV',
    location: {lat:49.4533143, lng:11.046309000000065},
    label: "4"
  },
  {
    title: 'Kaiserburg Nürnberg',
    location: {lat:49.457883, lng:11.075846299999967},
    label: "5"
  },
  {
    title: 'Nürnberger Christkindlesmarkt',
    location: {lat:49.4539708, lng:11.07733840000003},
    label: "6"
  },
  {
    title: 'Germanisches Nationalmuseum Nürnberg',
    location: {lat:49.4482487, lng:11.075511399999982},
    label: "7"
  },
  {
    title: 'Injoy Fitness',
    location: {lat:49.4596922, lng:11.034930799999984},
    label: "8"
  },
  {
    title: 'Friedrich-Alexander-Universität Erlangen-Nürnberg',
    location: {lat:49.4585979, lng:11.086073400000032},
    label: "9"
  },
  {
    title: 'Tiergarten Nürnberg',
    location: {lat:49.4468538, lng:11.14436390000003},
    label: "10"
  },
];

// Functionality to open the side navigation bar and set its width to 30% of the viewport.
function openNav() {
    document.getElementById("mySidenav").style.width = "30%";
}

// functionality to close the side navigation bar.
function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
}

// Google's function for initializing the map.
function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 49.449623, lng: 11.087262},
    zoom: 13,
    mapTypeId: 'hybrid',
  });
  infoWindow = new google.maps.InfoWindow();
  var  bounds = new google.maps.LatLngBounds();
  // The following group uses the location array to create an array of markers on initialize.
  for (var  i = 0; i < locationsNuernberg.length; i++) {
    // Get the position from the location array.
    var  position = locationsNuernberg[i].location;
    var  title = locationsNuernberg[i].title;
    var  label = locationsNuernberg[i].label;
    // Create a marker per location, and put into markers array.
    var marker = new google.maps.Marker({
      map: map,
      position: position,
      title: title,
      label: label,
      id:i
    });
    // By default markers are visible.
    marker.setVisible(true);
    vm.locationsList()[i].marker = marker;
    // On click on a marker the infowindow is opened.
    bounds.extend(marker.position);
    marker.addListener('click', function() {
      populateInfoWindow(this, infoWindow);
      animateUponClick(this);
    });
  }
}
// Adds a drop-animation when clicking a marker.
function animateUponClick(marker) {
  marker.setAnimation(google.maps.Animation.DROP);
  setTimeout(function() {
    marker.setAnimation(null);
  }, 1460);
}

// This function populates the infowindow when the marker is clicked.
// Modified from the Udacity lectures
function populateInfoWindow(marker, infowindow) {
  // Check to make sure the infowindow is not already opened on this marker.
  if (infowindow.marker != marker) {
    // Clear the infowindow content to give the streetview time to load.
    infowindow.setContent('');
    infowindow.marker = marker;
    // Make sure the marker property is cleared if the infowindow is closed.
    infowindow.addListener('closeclick', function() {
      infowindow.marker = null;
    });

    // Wikipedia API Ajax request.
    var  wikiURL = 'http://de.wikipedia.org/w/api.php?action=opensearch&search=' + marker.title + '&format=json&callback=wikiCallback';
    $.ajax(wikiURL,{
      dataType: "jsonp",
      data: {
        async: true
      }
    }).done(function(response) {
      var  articleStr = response[1];
      var  URL = 'http://de.wikipedia.org/wiki/' + articleStr;
      infowindow.setContent('<div>' +
        '<div class="info-header"><h2 class="info-title">' + marker.title + '</h2></div>' + '<h3 class="info-title2">Wikipedia Eintrag:<h3></div>' + '<a href ="' + URL + '">' + URL + '</a>');
      // Open the infowindow on the correct marker.
      infowindow.open(map, marker);
    }).fail(function(jqXHR, textStatus) {
      infowindow.setContent('<div>' +
        '<h2>' + marker.title + '</h2>' + '</div><br><p>Sorry. We could not contact Wikipedia!</p>');
        infowindow.open(map, marker);
    });
  }
} 
var googleError = function() {
  vm.mapError(true);
};
