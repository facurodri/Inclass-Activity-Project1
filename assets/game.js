// variables
var establishmentType = "";
var zipLocation = "";
var searchRadius = "";
var costRange = "";
var jokeQ="";
var punchLine="";

function displayJokes() {
  var queryURL = "https://official-joke-api.appspot.com/random_ten";

  $.ajax({
          url: queryURL,
          method: "GET"
      })
      .then(function(response) {
          console.log(response);
          var results = response;
          // cycle through each of the elements of the results array
          for (i = 0; i < results.length; i++) {

              jokeQ = $("#jokeQ").text(results[i].setup);
              punchLine = $("#jokeGen").text(results[i].punchline);
              
          }
      });
}
$(".skip").on("click", function () {
 displayJokes();
})

displayJokes();


$("#launch-search").on("click", function (event) {
    event.preventDefault();
    $("#resultsSpace").empty();
    var establishmentType = $("#establishment-input").val().trim();
    console.log(establishmentType);
    var zipLocation = $("#location-input").val().trim();
    console.log(zipLocation);
    var searchMiles = $("#radius-input").val().trim();
    console.log(searchMiles);
    var costRange = $("#cost-input").val().trim();
    if (costRange === "$") {
        costRange = 1
    } else if (costRange === "$$") {
        costRange = 2
    } else {
        costRange = 3
    }
    console.log(costRange);
    var searchRadius = searchMiles * 1600;
    console.log(searchRadius);
    var queryURL = "https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/search?term=" + establishmentType + "&location=" + zipLocation + "&radius=" + searchRadius + "&price=" + costRange + "&limit=5&";
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
            for (var j = 0; j < 5; j++) {
              var restaurantName = response.businesses[j].name;
              console.log(restaurantName);
              var restaurantAddress = response.businesses[j].location.address1 + ", " + response.businesses[j].location.city + ", " + response.businesses[j].location.state + " " + response.businesses[j].location.zip_code;
              console.log(restaurantAddress);
              var restaurantPhone = response.businesses[j].display_phone;
              console.log(restaurantPhone);
              var restaurantRating = response.businesses[j].rating;
              console.log("Rating: " + restaurantRating);
              createSearchCard(restaurantName);
            };

        })
    
});


function createSearchCard (restaurantName){
 
  var cardDiv = $('<div class="card border-light mb-3" style="max-width: 18rem;">').text(restaurantName);
  var restName = $("<div class='card title'>").text(restaurantName);
  var restAddress = $("<h5 class='card-text'>").text(restaurantAddress);
  
  cardDiv.append(restName);
  cardDiv.append(restAddress);
  $("#resultsSpace").append(cardDiv);
  
}

// function renderHTML(url, headline, author, content) {
//   $("#articles-space").empty();
//   var articlesDiv = $("<div class='card article'>");
//   var title = $("<p class='card title'>").html("<a target='_blank' href='" + url + "'>" + headline + "</a>");
//   var byline = $("<p class='card-text'>").html(author);
//   var blurb = $("<p class='card-text'>").html(content);
//   articlesDiv.append(title);
//   articlesDiv.append(byline);
//   articlesDiv.append(blurb);
//   articlesDiv.appendTo(myText);
//   $("#articles-space").prepend(myText);
// }