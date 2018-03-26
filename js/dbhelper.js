// COMMON DATABASE HELPER FUNCTIONS
class DBHelper {

  // DATABASE URL
  // CHANGE THIS TO RESTAURANTS.JSON FILE LOCATION ON YOUR SERVER
  static get DATABASE_URL() {
    const port = 9876 // Change this to your server port
    return `http://localhost:${port}/data/restaurants.json`;
  }

  // FETCH ALL RESTAURANTS
  static fetchRestaurants(callback) {
    let xhr = new XMLHttpRequest();
    xhr.open('GET', DBHelper.DATABASE_URL);
    xhr.onload = () => {
      if (xhr.status === 200) { // GOT A SUCCESS RESPONSE FROM SERVER!
        const json = JSON.parse(xhr.responseText);
        const restaurants = json.restaurants;
        callback(null, restaurants);
      } else { // OOPS!. GOT AN ERROR FROM SERVER.
        const error = (`Request failed. Returned status of ${xhr.status}`);
        callback(error, null);
      }
    };
    xhr.send();
  }

  // FETCH A RESTAURANT BY ITS ID
  static fetchRestaurantById(id, callback) {
    // FETCH ALL RESTAURANTS WITH PROPER ERROR HANDLING
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        const restaurant = restaurants.find(r => r.id == id);
        if (restaurant) { // GOT THE RESTAURANT
          callback(null, restaurant);
        } else { // RESTAURANT DOES NOT EXIST IN THE DATABASE
          callback('Restaurant does not exist', null);
        }
      }
    });
  }

  // FETCH RESTAURANTS BY A CUISINE TYPE WITH PROPER ERROR HANDLING
  static fetchRestaurantByCuisine(cuisine, callback) {
    // FETCH ALL RESTAURANTS WITH PROPER ERROR HANDLING
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // FILTER RESTAURANTS TO HAVE ONLY GIVEN CUISINE TYPE
        const results = restaurants.filter(r => r.cuisine_type == cuisine);
        callback(null, results);
      }
    });
  }

  // FETCH RESTAURANTS BY A NEIGHBORHOOD WITH PROPER ERROR HANDLING
  static fetchRestaurantByNeighborhood(neighborhood, callback) {
    // FETCH ALL RESTAURANTS
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // FILTER RESTAURANTS TO HAVE ONLY GIVEN NEIGHBORHOOD
        const results = restaurants.filter(r => r.neighborhood == neighborhood);
        callback(null, results);
      }
    });
  }

  // FETCH RESTAURANTS BY A CUISINE AND A NEIGHBORHOOD WITH PROPER ERROR HANDLING
  static fetchRestaurantByCuisineAndNeighborhood(cuisine, neighborhood, callback) {
    // FETCH ALL RESTAURANTS
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        let results = restaurants
        if (cuisine != 'all') { // FILTER BY CUISINE
          results = results.filter(r => r.cuisine_type == cuisine);
        }
        if (neighborhood != 'all') { // FILTER BY NEIGHBORHOOD
          results = results.filter(r => r.neighborhood == neighborhood);
        }
        callback(null, results);
      }
    });
  }

  // FETCH ALL NEIGHBORHOODS WITH PROPER ERROR HANDLING
  static fetchNeighborhoods(callback) {
    // FETCH ALL RESTAURANTS
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // GET ALL NEIGHBORHOODS FROM ALL RESTAURANTS
        const neighborhoods = restaurants.map((v, i) => restaurants[i].neighborhood)
        // REMOVE DUPLICATES FROM NEIGHBORHOODS
        const uniqueNeighborhoods = neighborhoods.filter((v, i) => neighborhoods.indexOf(v) == i)
        callback(null, uniqueNeighborhoods);
      }
    });
  }

  // FETCH ALL CUISINES WITH PROPER ERROR HANDLING
  static fetchCuisines(callback) {
    // FETCH ALL RESTAURANTS
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // GET ALL CUISINES FROM ALL RESTAURANTS
        const cuisines = restaurants.map((v, i) => restaurants[i].cuisine_type)
        // REMOVE DUPLICATES FROM CUISINES
        const uniqueCuisines = cuisines.filter((v, i) => cuisines.indexOf(v) == i)
        callback(null, uniqueCuisines);
      }
    });
  }

  // RESTAURANT PAGE URL
  static urlForRestaurant(restaurant) {
    return (`./restaurant.html?id=${restaurant.id}`);
  }

  // RESTAURANT IMAGE URL
  static imageUrlForRestaurant(restaurant) {
    return (`/img/${restaurant.photograph}`);
  }

  // MAP MARKER FOR A RESTAURANT
  static mapMarkerForRestaurant(restaurant, map) {
    const marker = new google.maps.Marker({
      position: restaurant.latlng,
      title: restaurant.name,
      url: DBHelper.urlForRestaurant(restaurant),
      map: map,
      animation: google.maps.Animation.DROP}
    );
    return marker;
  }

}
