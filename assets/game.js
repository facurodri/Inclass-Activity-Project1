


$("#searchbtn").on("click", function() {

    //variable to store a giphy API URL for random cat pic
    var queryURL = "https://api.nytimes.com/svc/news/v3/content/all/all.json?api-key=DTgGOT5P1qqG91MnjBKnu2rMxzyryB3phttps://api.giphy.com/v1/gifs/random?api_key=dc6zaTOxFJmzC&tag=cats";

    // ajax function to call/get API
    $.ajax({
      url: queryURL,
      method: "GET"
    })

    //second step once API is get, creates annonumus function with collected data
      .then(function(response) {

      //variable holds image from API
        var imageUrl = response;
        console.log(response);

        // creates image variable for giphy
        var catImage = $("<img>");

        //puts in attributes for images from API
        catImage.attr("src", imageUrl);
        catImage.attr("alt", "cat image");

        //post to the DOM
        $("#images").prepend(catImage);
      });
  });
  