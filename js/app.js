var  Location = function(data) {
  this.title = data.title;
  this.location = data.location;
};

var  ViewModel = function() {
  var  self = this;
  // Creates a marker for every location.
  self.locationsList = ko.observableArray([]);
  locationsNuernberg.forEach(function(location) {
    self.locationsList.push(new Location(location));
  });
  // Shows in case Google Maps is unavailable.
  self.mapError = ko.observable(false);

  // Filter functionality in the sidebar listview
  self.filter = ko.observable('');
  self.filteredLocations = ko.computed(function() {
    var  filterResult = self.filter().toLowerCase();

    if (filterResult == 0) {
      for (var i = 0; i < self.locationsList().length; i++) {
        if (self.locationsList()[i].marker) {
          self.locationsList()[i].marker.setVisible(true);
        }
      }
      return self.locationsList();
    } else {
      return ko.utils.arrayFilter(self.locationsList(), function(loc) {
        // Test to see if item matches filter and store results as a variable.
        var  match = loc.title.toLowerCase().indexOf(filterResult) >= 0;
        // Set marker visibility based on match status.
        if (loc.marker) {
          loc.marker.setVisible(match);
        }
        // Return match status to item in list view if it matches.
        return match;
      });
    }
  }, self);

// Click on button clears filter
  self.clearFilter = function() {
    self.filter('');

    for (var i = 0; i < self.locationsList().length; i++) {
      self.locationsList()[i].marker.setVisible(true);
    }
  };

// Click on location in sidebar-listview opens infowindow
  self.currentLocation = ko.observableArray([this.locationsList()[0]]);

  this.selectLocation = function(clickedLocation) {
    // Sets the currentLocation to selected element from the list view.
    self.currentLocation(clickedLocation);
    animateUponClick(clickedLocation.marker);
    // Populating the infowindow by clicked marker from list.
    populateInfoWindow(clickedLocation.marker, infoWindow);
  };
};

var  vm = new ViewModel();
ko.applyBindings(vm);
