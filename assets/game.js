// Initialize Firebase
var config = {
    apiKey: "AIzaSyDNAzAPsRxEWr0BTKS1vapd364ySRuCe-0",
    authDomain: "first-project-9f391.firebaseapp.com",
    databaseURL: "https://first-project-9f391.firebaseio.com",
    projectId: "first-project-9f391",
    storageBucket: "first-project-9f391.appspot.com",
    messagingSenderId: "290744685174"
 };

 firebase.initializeApp(config);
 
 //get data
 firebase.firestore().collection("first-project").get().then(snapshot => {
//    console.log(snapshot.docs)
 });
 
 
 //keeping track of user authentification status
 firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        // User is signed in.
        // console.log("user logged in: " + user)
    } else {
        // console.log("user logged out");
    }
 });
 
 //SIGN UP FUNCTION
 $("#sign-up").on("click", function () {
    
    // Grab values from text-boxes
    const firstName = $("#first-name").val().trim();
    const lastName = $("#last-name").val().trim();
    const email = $("#signup-email").val().trim();
    const pass = $("#signup-pass").val().trim();
    //console.log(email, pass)
 
    firebase.auth().createUserWithEmailAndPassword(email, pass).then(cred => {
        // console.log(cred.user)
        //handle errors
        //var errorCode = error.code;
        //var errorMessage = error.message;
 
        // Clears the text-boxes
        $("#first-name").val("");
        $("#last-name").val("");
        $("#signup-email").val("");
        $("#signup-pass").val("");
    })
 })
 
 //LOG OUT FUNCTION
 $("#log-out").on("click", function () {
    
    firebase.auth().signOut();
 });
 
 
 //LOG IN FUNCTION
 $("#log-in").on("click", function () {
    
    //get user info
    const email = $("#login-email").val().trim();
    const pass = $("#login-pass").val().trim();
 
    firebase.auth().signInWithEmailAndPassword(email, pass).then(cred => {
        // console.log(cred.user)
        //SEND TO MAIN PAGE 
        window.location.href = "index.html";
 
        $("#login-email").val("");
        $("#login-pass").val("");
    })
 })
// variables
var establishmentType = "";
var zipLocation = "";
var searchRadius = "";
var costRange = "";
var jokeQ = "";
var punchLine = "";
var mapAddress = "";

function displayJokes() {
    var queryURL = "https://official-joke-api.appspot.com/random_ten";

    $.ajax({
        url: queryURL,
        method: "GET"
    })
        .then(function (response) {
            // console.log(response);
            var results = response;
            // cycle through each of the elements of the results array
            for (i = 0; i < results.length; i++) {

                jokeQ = $("#jokeQ").text(results[i].setup);
                punchLine = $("#jokeGen").text(results[i].punchline);

            }
        });
}
$(".card-link").on("click", function () {
    displayJokes();
})

displayJokes();
createMapQuery();

$("#launch-search").on("click", function (event) {
    event.preventDefault();
    $("#resultsSpace").empty();
    var establishmentType = $("#establishment-input").val().trim();
    // console.log(establishmentType);
    var zipLocation = $("#location-input").val().trim();
    checkLength();
    // console.log(zipLocation);
    var searchMiles = $("#radius-input").val().trim();
    // console.log(searchMiles);
    var costRange = $("#cost-input").val().trim();
    // console.log(costRange);
    var searchRadius = searchMiles * 1600;
    // console.log(searchRadius);
    var queryURL = "https://cors-anywhere.herokuapp.com/api.yelp.com/v3/businesses/search?term=" + establishmentType + "&location=" + zipLocation + "&radius=" + searchRadius + "&price=" + costRange + "&limit=10&";
    $.ajax({
        url: queryURL,
        method: 'GET',
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', 'Bearer 5heKVWAAeZWxG448-Dgp3LTQj5RVwmWMhtdP4RRUGfe1QYKIFGKLxilcNz-qDIjtRl6Iyw93quLT-lEbLqjY5BdoYIP-ZORTdjRS4MmhrWBJm0k7g7rfIk44g-2DXHYx');
            xhr.setRequestHeader('Access-Control-Allow-Origin');
        },
    })
        .then(function (response) {
            console.log(response);
            var centerLat = response.region.center.latitude;
            var centerLong = response.region.center.longitude;
            // var myMap = initMap(centerLat, centerLong);
            console.log("latitude: ", centerLat, "longitude: ", centerLong);
            for (var j = 0; j < 5; j++) {
                var restaurantName = response.businesses[j].name;
                var restaurantAddress = response.businesses[j].location.address1 + ", " + response.businesses[j].location.city + ", " + response.businesses[j].location.state + " " + response.businesses[j].location.zip_code;
                var restaurantPhone = response.businesses[j].display_phone;
                var restaurantRating = response.businesses[j].rating;
                var ID = response.businesses[j].id;
                var latitude = response.businesses[j].coordinates.latitude;
                var longitude = response.businesses[j].coordinates.longitude;
                console.log(restaurantName, "latitude: " + latitude, "longitude: " + longitude);
                createSearchCard(restaurantName, restaurantAddress, restaurantPhone, restaurantRating, ID);
                // drawMap(myMap, latitude, longitude);
            };
        })
});

// function initMap (centerLat, centerLong) {
    // return L.map('mapid').setView([centerLat, centerLong], 13)
// }

// function drawMap (myMap, latitude, longitude) {
//     var marker = L.marker([latitude, longitude]).addTo(myMap);
//     marker.bindPopup("<b>Hello world!</b><br>I am a popup.").openPopup();
// }

function createSearchCard(restaurantName, restaurantAddress, restaurantPhone, restaurantRating, ID) {
    var cardDiv = $('<div class="card border-light mb-3" "width:18rem;">');
    var restName = $("<div class='card title' id='divRest" + ID + "'>").text(restaurantName);
    var restAddress = $("<h5 class='card-text' id='divAdd" + ID + "'>").text(restaurantAddress);
    var restPhone = $("<div class ='card-text' id='divPhone" + ID + "'>").text(restaurantPhone);
    var restRating = $("<div class ='card-text' id='divRating" + ID + "'>").text(restaurantRating);
    var mapButton = $("<button type='button' class='mapBtn' data-name='" + ID + "'>").text("Map this");
    cardDiv.append(restName);
    cardDiv.append(restAddress);
    cardDiv.append(restPhone);
    cardDiv.append(restRating);
    cardDiv.append(mapButton);
    // cardDiv.append(ID);
    $("#resultsSpace").append(cardDiv);
}

function invalidZIPModal() {
    var modal = document.getElementById('invalidZIPCode');
    modal.style.display = "block";
    modal.onclick = function () {
        modal.style.display = "none";
    }
}

function checkLength(zipLocation) {
    var zip = $("#location-input").val().trim();
    if (zip.length != 5) {
        invalidZIPModal();
    }
}

// var reply_click = function() {
//     alert("Button clicked, id "+this.id+", text"+this.innerHTML);
// }



function createMapQuery(ID) {
    $(".mapBtn").on("click", function () {
        var reply_click = document.getElementsByClassName('mapBtn').onclick;
        // var btnID = event.target.id
        // console.log(reply_click);
    })
}
        // function reply_click(clicked_id) {
        //     alert(clicked_id);
        // }
        // var mapAddress = $("#divAdd" + ID).text();
        // console.log(mapAddress);
//     })


// }


// function mapThis() {
//     $.ajax({
//         url: mapQueryURL,
//         method: "GET"
//     })
//         .then(function (response) {
//             console.log(response);
//             var results = response;
//             // cycle through each of the elements of the results array
//             for (i = 0; i < results.length; i++) {

//             }
//         });
// }

// http://www.mapquestapi.com/geocoding/v1/address?key=xFxVU4pZGhIu50jG3PO7DQiBnQiPSWcG&location=

