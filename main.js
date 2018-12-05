var oneWay = false; // boolean value
var root = "http://comp426.cs.unc.edu:3001/";
var root_url = "http://comp426.cs.unc.edu:3001/";
var departure, destination, date_go, date_back;

//use input text to search corresponding departure and arrival airport
var search_flight = function() {
  departure = $("#departure").val();            //get values of each input text
  destination = $("#destination").val();
  date_go = $(".oneway").val();
  date_back = $(".roundtrip").val();
  var departure_array, arrival_array;
  $.ajax(root_url + "airports?filter[code]=" + departure, {       //find departure with code
    type: "GET",
    xhrFields: {withCredentials: true},
    success: (de_response) => {
      if (de_response.length!=0){
        departure_array = de_response;
        $.ajax(root_url + "airports?filter[code]=" + destination, {//find arrival with code
          type: "GET",
          xhrFields: {withCredentials: true},
          success: (ar_response) => {
            if (ar_response.length!=0){
              arrival_array = ar_response;
              result_page(departure_array, arrival_array, departure, destination);  //call result page with each corresponding variables
            } else {
              $(".errormsg").html("No such Arrival...");
            }
          },
          error: () =>{
            alert("Please check your internet connection!");
          }
        });
      } else {
        $(".errormsg").html("No such Departure...");
      }
    },
    error: () =>{
      alert("Please check your internet connection!");
    }
  });
}

//build result_page interface
var result_page = function(departure_array, arrival_array, departure, destination){
  for (var i = 0; i < departure_array.length; i++){
    for (var j = 0; j< arrival_array.length; j++){
      $.ajax(root_url + "flights?filter[departure_id]=" + departure_array[i].id + "&filter[arrival_id]=" + arrival_array[j].id, {
        type: "GET",
        xhrFields: {withCredentials: true},
        async: false, 
        success: (response) => {
          //for each response, build its own div with specific information
          //consider if the trip is oneway or roundtrip, building different interfaces for each
          if (oneWay){
            if (response.length!=0){
              $(".result-container").append("<div class = 'results'></div>");
              for (var count = 0; count < response.length; count++){
                $(".results").append("<div class = 'result' id = 'result_" + count + "' ></div>");
                let time = response[count].departs_at.substring(11, 16);
                time += " - ";
                time += response[count].arrives_at.substring(11, 16);
                find_airline(response[count].airline_id, count, time, "#result_");
              }
              $(".errormsg").html("");
            }
          } else {
            if (response.length!=0){
              $(".result-container").append("<div class = 'results_go'></div>");
              for (var count = 0; count < response.length; count++){
                $(".results_go").append("<div class = 'result_go' id = 'result_go_" + count + "' ></div>");
                let time = response[count].departs_at.substring(11, 16);
                time += " - ";
                time += response[count].arrives_at.substring(11, 16);
                find_airline(response[count].airline_id, count, time, "#result_go_");
              }
              $(".errormsg").html("");
            }

            $(".errormsg").html("");

          }
        },
        error: () =>{
          alert("Please check your internet connection!");
        }
      });
    }
  }
  if ($(".result-container").is(":empty")){
    $(".errormsg").html("No such Flights...");
  } else {
    if (oneWay){
      $(".results").prepend("<h1 class = 'title'> Select Flight");
      $(".result-container").append("<button class = 'submit' id = 'one'>Buy Now</button>");
    } else {
      $(".results_go").prepend("<h1 class = 'title'> Select Departure Flight");
      $(".result-container").append("<button class = 'submit' id = 'round'>Buy Now</button>");
    }
  }

}

//search airline with corresponding airline_id
var find_airline = function(id, count, time, cname){
  let result;
  $.ajax(root_url + "airlines/" + id, {
    type: "GET",
    xhrFields: {withCredentials: true},
    success: (air_response) =>{
      console.log(air_response);
      result = air_response.name;
      $(cname + count).append("<div class = 'flight_airline' id = 'flight_airline_" + count + "' >" + result + "</div>");
      $(cname + count).append("<div class = 'flight_time' id = 'flight_time_" + count + "' >" + time + "</div>");
      $(cname + count).append("<div class = 'flight_places id = 'flight_places_" + count + "' >" + departure + " -> " + destination + "</div>");
    },
    error: ()=>{
      alert("Please check your internet connection!");
    }
  });
}

//add boolean value, attr('class','oneway')
// submit function if null, show error else call search_flight();
function change(){
  var select = document.getElementById("mySelect").value;
  if(select == 'oneway'){
     $(".roundtrip").hide();
     oneWay = true;
  }else{
    $(".roundtrip").show();
    oneWay = false;
  }


}


function submit(){
  // first check whether all the values are filled or no
  let dep = $('#departure').val();
   let des = $('#destination').val();
   $('.result-container').empty();
  if(dep==""){
     $('.errormsg').html("Please enter your departure airport");
  }
  else if (des==""){
       $('.errormsg').html("Please enter your destination airport");
  }
  else{
       $('.errormsg').html("");
       search_flight();
  }
}
