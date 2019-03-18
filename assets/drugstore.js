// variables
var establishmentType = "";
var latitude = "";
var longitude = "";
var mymap = "";
var needZip = "false";

$(document).ready(function () {
    $('select').formSelect();
    $('.sidenav').sidenav();
    $('#zip-it').hide();
    getLocation();

    $("#launch-search").on("click", function (event) {
        event.preventDefault();
        $("#my-location").empty();
        // marker.clearLayers();
        // initMap(latitude, longitude);
        var drugStore = $("#store-input").val().trim();
        if (needZip === "true") {
            var zipLocation = $("#location-input").val().trim();
            var queryURL = "https://cors-anywhere.herokuapp.com/api.yelp.com/v3/businesses/search?term=" + drugStore + "&location=" + zipLocation + "&radius=16000&limit=10&";
        } else {
            var queryURL = "https://cors-anywhere.herokuapp.com/api.yelp.com/v3/businesses/search?term=" + drugStore + "&latitude=" + latitude + "&longitude=" + longitude + "&radius=16000&limit=10&";
        }
        $.ajax({
            url: queryURL,
            method: 'GET',
            beforeSend: function (xhr) {
                xhr.setRequestHeader('Authorization', 'Bearer 5heKVWAAeZWxG448-Dgp3LTQj5RVwmWMhtdP4RRUGfe1QYKIFGKLxilcNz-qDIjtRl6Iyw93quLT-lEbLqjY5BdoYIP-ZORTdjRS4MmhrWBJm0k7g7rfIk44g-2DXHYx');
                xhr.setRequestHeader('Access-Control-Allow-Origin');
            },
        })
            .then(function (response) {
                for (var j = 1; j < response.businesses.length; j++) {
                    var restaurantName = response.businesses[j].name;
                    var restaurantAddress = response.businesses[j].location.address1 + ", " + response.businesses[j].location.city + ", " + response.businesses[j].location.state + " " + response.businesses[j].location.zip_code;
                    var restaurantPhone = response.businesses[j].display_phone;
                    var ID = response.businesses[j].id;
                    var restaurantLatitude = response.businesses[j].coordinates.latitude;
                    var restaurantLongitude = response.businesses[j].coordinates.longitude;
                    marker = L.marker([restaurantLatitude, restaurantLongitude]).addTo(mymap);
                    marker.bindPopup("<b>" + restaurantName + "</b><br>" + restaurantAddress + "<br>" + restaurantPhone).openPopup();
                }
                var restaurantName = response.businesses[0].name;
                var restaurantAddress = response.businesses[0].location.address1 + ", " + response.businesses[0].location.city + ", " + response.businesses[0].location.state + " " + response.businesses[0].location.zip_code;
                var restaurantPhone = response.businesses[0].display_phone;
                var ID = response.businesses[0].id;
                var restaurantLatitude = response.businesses[0].coordinates.latitude;
                var restaurantLongitude = response.businesses[0].coordinates.longitude;
                marker = L.marker([restaurantLatitude, restaurantLongitude]).addTo(mymap);
                marker.bindPopup("<b>" + restaurantName + "</b><br>" + restaurantAddress + "<br>" + restaurantPhone).openPopup();
            });
    });
})

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        $('#zip-it').style.display = "block";
        needZip = "true";
    }
}
function showPosition(position) {
    latitude = position.coords.latitude
    longitude = position.coords.longitude
    initMap(latitude, longitude);
}
function initMap(latitude, longitude) {
    mymap = L.map("mymap").setView([latitude, longitude], 13);
    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox.streets',
        accessToken: 'sk.eyJ1IjoiZWhhYnJhc3VsIiwiYSI6ImNqdDlhZTIzczAxemc0NHBtYXJzd2hrN2oifQ.zvIfEYP1713Hn7KORi25Nw'
    }).addTo(mymap);
    var marker = L.marker([latitude, longitude]).addTo(mymap);
    marker.bindPopup("<b>You are here").openPopup();
}
function drawPins(restaurantLatitude, restaurantLongitude) {
    var marker = L.marker([restaurantLatitude, restaurantLongitude]).addTo(mymap);
    marker.bindPopup("<b>" + restaurantName + "</b><br>" + restaurantAddress + "<br>" + restaurantPhone).openPopup();
}
