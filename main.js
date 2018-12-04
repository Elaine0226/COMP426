var oneWay = true; // boolean value
var root = "http://comp426.cs.unc.edu:3001/";
var root_url = "http://comp426.cs.unc.edu:3001/";
var departure, destination;
var search_flight = function() {
  departure = $("#departure").val();
  destination = $("#destination").val();
  console.log(departure);
  var departure_array, arrival_array;
  $.ajax(root_url + "airports?filter[code]=" + departure, {
    type: "GET",
    xhrFields: {withCredentials: true},
    success: (de_response) => {
      if (de_response.length!=0){
        console.log(de_response);
        departure_array = de_response;
        $.ajax(root_url + "airports?filter[code]=" + destination, {
          type: "GET",
          xhrFields: {withCredentials: true},
          success: (ar_response) => {
            console.log(ar_response);
            if (ar_response.length!=0){
              arrival_array = ar_response;
              result_page(departure_array, arrival_array, departure, destination);
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

var result_page = function(departure_array, arrival_array, departure, destination){
  for (var i = 0; i < departure_array.length; i++){
    for (var j = 0; j< arrival_array.length; j++){
      $.ajax(root_url + "flights?filter[departure_id]=" + departure_array[i].id + "&filter[arrival_id]=" + arrival_array[j].id, {
        type: "GET",
        xhrFields: {withCredentials: true},
        success: (response) => {
          //console.log(response);
          if (response.length!=0){
            for (var count = 0; count < response.length; count++){
              console.log(response[count]);
              $(".result-container").append("<div class = 'result' id = 'result_" + count + "' ></div>");
              $("#result_" + count).append("<div class = 'flight_time' id = 'flight_time_" + count + "' >" + response[count].departs_at + "-" + response[count].arrives_at + "</div>");
              $("#result_" + count).append("<div class = 'flight_places id = 'flight_places_" + count + "' >" + departure + "->" + destination + "</div>");
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
  }
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
