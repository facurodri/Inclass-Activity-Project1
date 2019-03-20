//Gets materialize ready to use when page loads
$(document).ready(function () {
    $(".modal").modal();
    $(".sidenav").sidenav();
    $("select").formSelect();
});

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


//LOG OUT FUNCTION
$("#log-out").on("click", function () {
    firebase.auth().signOut();
    console.log("logged out");
    window.location.href = "loginPage.html";
});

//LOG IN FUNCTION
$("#log-in").on("click", function () {
    event.preventDefault();
    //get user 
   
    const email = $("#login-email").val().trim();
    const pass = $("#login-pass").val().trim();
    

    firebase.auth().signInWithEmailAndPassword(email, pass).then(cred => {
     console.log("logged in");
        //SEND TO MAIN PAGE 
        window.location.href = "index.html";

        $("#login-email").val("");
        $("#login-pass").val("");

    })

});

//keeping track of user authentification status
firebase.auth().onAuthStateChanged(function (user) {
    
    var user = firebase.auth().currentUser;
    console.log(user);

    if (user) {
        console.log("user logged in");
    } 
    else {
        console.log("user logged out");
    }
});
//TESTIMONIALS SECTION
var modal = document.getElementById('myModalSuccess');

function uploadSuccess() {
    modal.style.display = "block";
};

$("#add-comment").on("click", function (event) {
    event.preventDefault();

    uploadSuccess();
    //button for closing modal 
    $(".closeBtn").on("click", function () {
        modal.style.display = "none";

    });
});



//LOG OUT FUNCTION
$("#log-out").on("click", function () {
    // firebase.auth().signOut();
    console.log('this buttons');
    window.location.href = "loginPage.html";
 });
 $("#skip").on("click", function () {
        window.location.href = "index.html";
 });
//SIGN UP FUNCTION
$("#sign-up").on("click", function () {

    // Grab values from text-boxes
    var userName = $("#user-name").val().trim();
    const email = $("#signup-email").val().trim();
    const pass = $("#signup-pass").val().trim();

    database.ref().push({
        userName: userName,
        email: email
    })
   
    console.log(userName)
    firebase.auth().createUserWithEmailAndPassword(email, pass).then(cred => {
        
        // Clears the text-boxes
         
        $("#user-name").val("");
        $("#signup-email").val("");
        $("#signup-pass").val("");
    })
});


  

// variables
var establishmentType = "";
var zipLocation = "";
var searchRadius = "";
var costRange = "";
var jokeQ = "";
var punchLine = "";
var mapAddress = "";
var resultsJoke = [];

function displayJokes() {
    var queryURL = "https://official-joke-api.appspot.com/random_ten";

    $.ajax({
            url: queryURL,
            method: "GET"
        })
        .then(function (response) {
            // console.log(response);
            resultsJoke = response;
            // cycle through each of the elements of the results array
            for (i = 0; i < resultsJoke.length; i++) {

                var jokeDiv = $("<div class='card center'>");
                jokeDiv.addClass("jokes col l4 m6 s12")
                jokeDiv.append("<div ='card-content'>");
                jokeQ = resultsJoke[i].setup;
                var jQ = $("<p>").text(jokeQ);
                jokeDiv.append(jQ);

                punchLine = resultsJoke[i].punchline;
                var pL = $("<p>").text(punchLine);
                jokeDiv.append(pL);

                $(".jokesContainer").append(jokeDiv);

            }
        });
}
$(".card-link").on("click", function () {
    displayJokes();
})

displayJokes();
newSearch();

$("#launch-search").on("click", function (event) {
    event.preventDefault();
    var establishmentType = $("#establishment-input").val().trim();
    var zipLocation = $("#location-input").val().trim();
    if (zipLocation.length != 5 || establishmentType === "" || zipLocation === "" || searchMiles === "") {
        invalidFormModal();
    } else {
        var searchMiles = $("#radius-input").val().trim();
        var costRange = $("#cost-input").val().trim();
        var searchRadius = searchMiles * 1600;
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
                initMap(centerLat, centerLong);
                $("#searchField").hide();
                $("#new-search").show();
                console.log("latitude: ", centerLat, "longitude: ", centerLong);
                for (var j = 1; j < response.businesses.length; j++) {
                    var restaurantName = response.businesses[j].name;
                    var restaurantAddress = response.businesses[j].location.address1 + ", " + response.businesses[j].location.city + ", " + response.businesses[j].location.state + " " + response.businesses[j].location.zip_code;
                    var restaurantPhone = response.businesses[j].display_phone;
                    var restaurantRating = response.businesses[j].rating;
                    var ID = response.businesses[j].id;
                    var restaurantLatitude = response.businesses[j].coordinates.latitude;
                    var restaurantLongitude = response.businesses[j].coordinates.longitude;
                    marker = L.marker([restaurantLatitude, restaurantLongitude]).addTo(mymap);
                    marker.bindPopup("<b>" + restaurantName + "</b><br>" + restaurantAddress + "<br>" + restaurantPhone).openPopup();
                    console.log(restaurantName, "latitude: " + restaurantLatitude, "longitude: " + restaurantLongitude);
                }
                var restaurantName = response.businesses[0].name;
                var restaurantAddress = response.businesses[0].location.address1 + ", " + response.businesses[0].location.city + ", " + response.businesses[0].location.state + " " + response.businesses[0].location.zip_code;
                var restaurantPhone = response.businesses[0].display_phone;
                var restaurantRating = response.businesses[0].rating;
                var ID = response.businesses[0].id;
                var restaurantLatitude = response.businesses[0].coordinates.latitude;
                var restaurantLongitude = response.businesses[0].coordinates.longitude;
                marker = L.marker([restaurantLatitude, restaurantLongitude]).addTo(mymap);
                marker.bindPopup("<b>" + restaurantName + "</b><br>" + restaurantAddress + "<br>" + restaurantPhone + "<br>Yelp rating: " + restaurantRating).openPopup();
            });
    }
});

function newSearch() {
    $("#new-search").on("click", function (event) {
        $("#searchField").show();
        $("#new-search").hide();
        location.reload();

    })
}
function initMap(centerLat, centerLong) {
    mymap = L.map("mymap").setView([centerLat, centerLong], 13);
    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox.streets',
        accessToken: 'sk.eyJ1IjoiZWhhYnJhc3VsIiwiYSI6ImNqdDlhZTIzczAxemc0NHBtYXJzd2hrN2oifQ.zvIfEYP1713Hn7KORi25Nw'
    }).addTo(mymap);
}

function drawPins(restaurantLatitude, restaurantLongitude) {
    var marker = L.marker([restaurantLatitude, restaurantLongitude]).addTo(mymap);
    marker.bindPopup("<b>" + restaurantName + "</b><br>" + restaurantAddress + "<br>" + restaurantPhone).openPopup();
}

function invalidFormModal() {
    var modal = document.getElementById('invalidZIPCode');
    modal.style.display = "block";
    modal.onclick = function () {
        modal.style.display = "none";
    }
}
