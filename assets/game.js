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
    window.location.href = "loginPage.html";
});

//LOG IN FUNCTION
$("#log-in").on("click", function () {
    event.preventDefault();
    //get user 
   
    const email = $("#login-email").val().trim();
    const pass = $("#login-pass").val().trim();
    

    firebase.auth().signInWithEmailAndPassword(email, pass).then(cred => {
    
        //SEND TO MAIN PAGE 
        window.location.href = "index.html";

        $("#login-email").val("");
        $("#login-pass").val("");

    })
})
//ANONYMOUS SIGN IN

$("#skip").on("click", function () {
    window.location.href = "index.html";

});

//keeping track of user authentification status
firebase.auth().onAuthStateChanged(function (user) {
    console.log(user)
    var user = firebase.auth().currentUser;

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

var database = firebase.database();
var name = "";
var comment = "";
var userName = "";


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
})

//button for submitting comment 
$("#submit").on("click", function (name, comment) {

    //grab user input 
    var name = $("#name-input").val().trim();
    var comment = $("#comment-input").val().trim();
    

    // Creates local "temporary" object for holding data 
    var userData = {
        name: name,
        comment: comment,
        dateAdded: firebase.database.ServerValue.TIMESTAMP
    };

    // Uploads user data to the database
    database.ref().push(userData);
    // Logs everything to console
    console.log(userData.userName);
    console.log(userData.comment);

    //create a new div 
    var a = $("<div>");
    var newComment = $("<p>").text(comment);
    newComment.addClass("card-body");
    a.addClass("card");
    var newName = $("<footer>").text(name);
    newName.addClass("blockquote-footer");

    //append new name and comment to the new div 
    a.append(newComment);
    a.append(newName);

    $(".comment-div").append(a);

    //clear text boxes 
    $("#name-input").val("");
    $("#comment-input").val("");
})

// Create Firebase event for adding comment to the database and a div in the html when a user adds an entry

    database.ref().on("child_added", function (childSnapshot) {
        // storing the snapshot.val() in a variable 
        var sv = childSnapshot.val();
        const name = sv.newName;
        const comment = sv.newComment;

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
            //console.log(response);
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
    console.log(establishmentType);
    var zipLocation = $("#location-input").val().trim();
    checkLength();
    console.log(zipLocation);
    var searchMiles = $("#radius-input").val().trim();
    console.log(searchMiles);
    var costRange = $("#cost-input").val().trim();
    console.log(costRange);
    var searchRadius = searchMiles * 1600;
    console.log(searchRadius);
    var queryURL = "https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/search?term=" + establishmentType + "&location=" + zipLocation + "&radius=" + searchRadius + "&price=" + costRange + "&limit=10&";
    // var queryURL = "https://api.yelp.com/v3/businesses/search?location=cleveland";
    // var queryURL = "https://api.yelp.com/v3/businesses/search?term=" + establishmentType + "&location=" + zipLocation + "&radius=" + searchRadius + "&price=" + costRange + "&limit=5&";
    // var queryURL = "https://api.yelp.com/v3/businesses/search?"
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
            for (var j = 0; j < 10; j++) {
                var restaurantName = response.businesses[j].name;
                console.log(restaurantName);
                var restaurantAddress = response.businesses[j].location.address1 + ", " + response.businesses[j].location.city + ", " + response.businesses[j].location.state + " " + response.businesses[j].location.zip_code;
                console.log(restaurantAddress);
                var restaurantPhone = response.businesses[j].display_phone;
                console.log(restaurantPhone);
                var restaurantRating = response.businesses[j].rating;
                console.log("Rating: " + restaurantRating);
                var ID = response.businesses[j].id;
                console.log("ID = " + ID);
                createSearchCard(restaurantName, restaurantAddress, restaurantPhone, restaurantRating, ID);
            };

        })

});


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


function createMapQuery() {
    $(".mapBtn").on("click", function () {
        ID
        mapAddress = $("#divAdd" + ID).text();
        console.log(mapAddress);
    })


}

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