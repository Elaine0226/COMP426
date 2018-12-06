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
  if (oneWay){
    $(".result-container").append("<div class = 'results'></div>");
    $(".results").prepend("<h1 class = 'title'> Select Flight</h1>");
    $(".result-container").append("<button class = 'submit' id = 'one'>Buy Now</button>");
  } else {
    $(".result-container").append("<div class = 'results_go'></div>");
    $(".result-container").append("<div class='results_back'></div>");
    $(".results_back").prepend("<h1 class='title'>Select Return Flight</h1>");
    $(".results_go").prepend("<h1 class = 'title'> Select Departure Flight</h1>");
    $(".result-container").append("<button class = 'submit' id = 'round'>Buy Now</button>");
  }
  var k = 0;
  for (var i = 0; i < departure_array.length; i++){
    for (var j = 0; j< arrival_array.length; j++){
      $.ajax(root_url + "flights?filter[departure_id]=" + departure_array[i].id + "&filter[arrival_id]=" + arrival_array[j].id, {
        type: "GET",
        xhrFields: {withCredentials: true},
        success: (response) => {
          //for each response, build its own div with specific information
          //consider if the trip is oneway or roundtrip, building different interfaces for each
          if (oneWay){
            if (response.length!=0){ //flight info
              for (var count = 0; count < response.length; count++){
                $(".results").append("<div class = 'result' id = 'result_" + k + "' ></div>");



                id = '#result_'+k;
                if(k==1){
                  $(id).append("<input type='radio' id='oneWay_go_"+k+"' class='oneWay_go_' name='oneWay_go_button' checked>")
                }else{
                  $(id).append("<input type='radio' id='oneWay_go_"+k+"' class='oneWay_go_' name='oneWay_go_button'>")
                }

                let time = response[count].departs_at.substring(11, 16);
                time += " - ";
                time += response[count].arrives_at.substring(11, 16);
                find_airline(response[count].airline_id, k, time, "#result_", departure, destination);
                addDetails(response[count],'#result_'+k,k,departure,destination);
                k++;

              }
              $(".errormsg").html("");
            }
          } else {
            if (response.length!=0){
              for (var count = 0; count < response.length; count++){
                $(".results_go").append("<div class = 'result_go' id = 'result_go_" + k + "' ></div>");
                let time = response[count].departs_at.substring(11, 16);

                // add buttons for roundButtons for 'go'
                id = '#result_go_'+k;
                if(k==1){
                    $(id).append("<input type='radio' id='roundTrip_go_" + k + "' class='roundTrip_go' name='roundTrip_go_button' checked>")
                }
                else {$(id).append("<input type='radio' id='roundTrip_go_" + k + "' class='roundTrip_go' name='roundTrip_go_button'>")}
                 //
                time += " - ";
                time += response[count].arrives_at.substring(11, 16);
                find_airline(response[count].airline_id, k, time, "#result_go_", departure, destination);
                k++;
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
  if(!oneWay){
    returnFlight(arrival_array,departure_array);
  }

}

//search airline with corresponding airline_id
var find_airline = function(id, count, time, cname, depart, arrive){
  let result;
  $.ajax(root_url + "airlines/" + id, {
    type: "GET",
    xhrFields: {withCredentials: true},
    success: (air_response) =>{
      console.log(air_response);
      result = air_response.name;
      $(cname + count).append("<div class = 'flight_airline' id = 'flight_airline_" + count + "' >" + result + "</div>");
      $(cname + count).append("<div class = 'flight_time' id = 'flight_time_" + count + "' >" + time + "</div>");
      $(cname + count).append("<div class = 'flight_places id = 'flight_places_" + count + "' >" + depart + " -> " + arrive + "</div>");
      $(cname + count).append("<button onclick='showDetails(e)'>Details</button>")
    },
    error: ()=>{
      $(cname+count).remove();
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

function returnFlight(departure_array, arrival_array){
  var k = 0;
  for (var i = 0; i < departure_array.length; i++){
    for (var j = 0; j< arrival_array.length; j++){
      $.ajax(root_url + "flights?filter[departure_id]=" + departure_array[i].id + "&filter[arrival_id]=" + arrival_array[j].id, {
        type: "GET",
        xhrFields: {withCredentials: true},
        success: (response) => {
          //for each response, build its own div with specific information
          //consider if the trip is oneway or roundtrip, building different interfaces for each

            if (response.length!=0){
              for (var count = 0; count < response.length; count++){
                $(".results_back").append("<div class = 'result_back' id = 'result_back_" + k + "' ></div>");

                // Add buttons for selecting returning flights.
                id = '#result_back_'+k;
                if (k==1){
                  $(id).append("<input type='radio' id='roundTrip_back_"+ k + "' class='roundTrip_back' name='roundTrip_back_button' checked>")
                }
                //id = '#result_back_'+k;
                else {$(id).append("<input type='radio' id='roundTrip_back_" + k + "' class='roundTrip_back' name='roundTrip_back_button'>")}



                let time = response[count].departs_at.substring(11, 16);
                time += " - ";
                time += response[count].arrives_at.substring(11, 16);
                find_airline(response[count].airline_id, k, time, "#result_back_", destination, departure);
                k++;
              }
              $(".errormsg").html("");
            }

            $(".errormsg").html("");


        },
        error: () =>{
          alert("Please check your internet connection!");
        }
      });
    }
  }

}

function diff(start, end) {
    start = start.split(":");
    end = end.split(":");
    var startDate = new Date(0, 0, 0, start[0], start[1], 0);
    var endDate = new Date(0, 0, 0, end[0], end[1], 0);
    var diff = endDate.getTime() - startDate.getTime();
    var hours = Math.floor(diff / 1000 / 60 / 60);
    diff -= hours * 1000 * 60 * 60;
    var minutes = Math.floor(diff / 1000 / 60);

    // If using time pickers with 24 hours format, add the below line get exact hours
    if (hours < 0)
       hours = hours + 24;

    return (hours <= 9 ? "0" : "") + hours + ":" + (minutes <= 9 ? "0" : "") + minutes;
}

function findCompany(id){

}

 function addDetails(response,id,k,depart, arrival){
   let time = response.departs_at.substring(11, 16);
   // response[count] single flight
   // add select buttons
   let departTime = 'Departure Time: '+ response.departs_at.substring(11,16);
   let arrTime = 'Arrival Time: '+ response.arrives_at.substring(11,16);
   let flightNumber = 'Flight Number: ' + response.number;
   let depart1 = 'Departure Airport: ' + depart;
   let destin = 'Destination Airport: '+ arrival;

   let departHour = parseInt(response.departs_at.substring(11,13))*60;
   let departMin = parseInt(response.departs_at.substring(14,16))
   let t1 = departHour + departMin;
   let arriveHour = parseInt(response.arrives_at.substring(11,13))*60;
   let arriveMin = parseInt(response.arrives_at.substring(14,16))
   let t2 = arriveHour + arriveMin;
   let timeLast = 'Time on the air: '+(t2 - t1)/60.00 + 'Hours';

   let detailDiv = $('<div class="details" id="details_'+k+'" ></div>')
   $(id).append(detailDiv);

   let departTimeDiv = $('<div>'+departTime+'</div>');
   let arrivalTimeDiv = $('<div>'+arrTime+'</div>');
   let flightNumberDiv = $('<div>'+flightNumber+'</div>');
   let departAirDiv = $('<div>'+depart1+'</div>');
    let destinAirDiv = $('<div>'+destin+'</div>');
     let timeLastDiv = $('<div>'+timeLast+'</div>');

     detailDiv.append(departTimeDiv);
     detailDiv.append(arrivalTimeDiv);
     detailDiv.append(flightNumberDiv);
     detailDiv.append(departAirDiv);
     detailDiv.append(destinAirDiv);
     detailDiv.append(timeLastDiv);

 }
