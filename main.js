var oneWay = false; // boolean value
var root = "http://comp426.cs.unc.edu:3001/";
var root_url = "http://comp426.cs.unc.edu:3001/";
var departure, destination, date_go, date_back;
var selected, selected_go, selected_back; //variables for recording selected flights_id onchange of input radio
var planeResult;

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
  } else {
    $(".result-container").append("<div class = 'results_go'></div>");
    $(".result-container").append("<div class='results_back'></div>");
    $(".results_back").prepend("<h1 class='title'>Select Return Flight</h1>");
    $(".results_go").prepend("<h1 class = 'title'> Select Departure Flight</h1>");
  }
  var k = 0;
  for (var i = 0; i < departure_array.length; i++){
    for (var j = 0; j< arrival_array.length; j++){
      var dname = departure_array[i].name;
      var aname = arrival_array[j].name;
      $.ajax(root_url + "flights?filter[departure_id]=" + departure_array[i].id + "&filter[arrival_id]=" + arrival_array[j].id, {
        type: "GET",
        xhrFields: {withCredentials: true},
        async: false,
        success: (response) => {
          //for each response, build its own div with specific information
          //consider if the trip is oneway or roundtrip, building different interfaces for each
          if (oneWay){
            if (response.length!=0){ //flight info
              for (var count = 0; count < response.length; count++){
                $(".results").append("<div class = 'result' id = 'result_" + k + "' ></div>");
                //add a div called "general" which will include general information of a flight(not detail information)
                //so that button of "detail" and input radio can be placed at where you want by using before() and after()
                $("#result_"+k).append("<div class = 'general' id = 'general_" + k + "' ></div>");
                id = '#general_'+k;
                //add buttons for oneway
                if(k==1){
                  $(id).before("<input type='radio' onchange='selectFlight(" + response[count].id + ")' id='oneWay_go_"+k+"' class='oneWay_go_' name='oneWay_go_button' checked>");
                  selected = response[count].id;
                }else{
                  $(id).before("<input type='radio' onchange='selectFlight(" + response[count].id + ")' id='oneWay_go_"+k+"' class='oneWay_go_' name='oneWay_go_button'>")
                }

                let time = response[count].departs_at.substring(11, 16);
                time += " - ";
                time += response[count].arrives_at.substring(11, 16);
                find_airline(response[count].airline_id, k, time, "#general_", departure, destination);
                addDetails(response[count],'#result_'+k,k,departure,destination,dname,aname,date_go);
                k++;

              }
              $(".errormsg").html("");
            }
          } else {
            if (response.length!=0){
              for (var count = 0; count < response.length; count++){
                $(".results_go").append("<div class = 'result_go' id = 'result_go_" + k + "' ></div>");
                $("#result_go_"+k).append("<div class = 'general_go' id = 'general_go_" + k + "' ></div>");
                let time = response[count].departs_at.substring(11, 16);
                // add buttons for roundButtons for 'go'
                id = '#general_go_'+k;
                if(k==1){
                    $(id).before("<input onchange='selectFlight_go(" + response[count].id + ")' type='radio' id='roundTrip_go_" + k + "' class='roundTrip_go' name='roundTrip_go_button' checked>");
                    selected_go = response[count].id;
                }
                else {
                  $(id).before("<input type='radio' onchange='selectFlight_go(" + response[count].id + ")' id='roundTrip_go_" + k + "' class='roundTrip_go' name='roundTrip_go_button'>")
                }
                 //
                time += " - ";
                time += response[count].arrives_at.substring(11, 16);
                find_airline(response[count].airline_id, k, time, "#general_go_", departure, destination);
                addDetails(response[count],'#result_go_'+k,k,departure,destination,dname,aname,date_go);
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
    $(".result-container").after("<button onclick = 'buyRoundtrip()' class = 'submit' id = 'round'>Buy Now</button>");
    if (k==0){
      $(".results_go").append("<div class = 'error_m'>Sorry, no such flights...</div>");
    }
  } else {
    $(".result-container").after("<button onclick = 'buyOneway()' class = 'submit' id = 'one'>Buy Now</button>");
    if (k==0){
      $(".results").append("<div class = 'error_m'>Sorry, no such flights...</div>");
    }
  }

}

//search airline with corresponding airline_id
var find_airline = function(id, count, time, cname, depart, arrive){
  let result;
  $.ajax(root_url + "airlines/" + id, {
    type: "GET",
    xhrFields: {withCredentials: true},
    success: (air_response) =>{
      result = air_response.name;
      $(cname + count).prepend("<button onclick='showDetails(event)'>Details</button>");
      $(cname + count).prepend("<div class = 'flight_places id = 'flight_places_" + count + "' >" + depart + " -> " + arrive + "</div>");
      $(cname + count).prepend("<div class = 'flight_time' id = 'flight_time_" + count + "' >" + time + "</div>");
      $(cname + count).prepend("<div class = 'flight_airline' id = 'flight_airline_" + count + "' >" + result + "</div>");
    },
    error: ()=>{
      $(cname+count).parent().remove();
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
   $('.submit').remove();
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
      var dname = departure_array[i].name;
      var aname = arrival_array[j].name;
      $.ajax(root_url + "flights?filter[departure_id]=" + departure_array[i].id + "&filter[arrival_id]=" + arrival_array[j].id, {
        type: "GET",
        xhrFields: {withCredentials: true},
        async: false,
        success: (response) => {
          //for each response, build its own div with specific information
          //consider if the trip is oneway or roundtrip, building different interfaces for each

            if (response.length!=0){
              for (var count = 0; count < response.length; count++){
                $(".results_back").append("<div class = 'result_back' id = 'result_back_" + k + "' ></div>");
                $("#result_back_"+k).append("<div class = 'general_back' id = 'general_back_" + k + "' ></div>");
                // Add buttons for selecting returning flights.
                id = '#general_back_'+k;
                if (k==1){
                  $(id).before("<input type='radio' onchange='selectFlight_back(" + response[count].id + ")' id='roundTrip_back_"+ k + "' class='roundTrip_back' name='roundTrip_back_button' checked>");
                  selected_back = response[count].id;
                }
                //id = '#result_back_'+k;
                else {
                  $(id).before("<input type='radio' onchange='selectFlight_back(" + response[count].id + ")' id='roundTrip_back_" + k + "' class='roundTrip_back' name='roundTrip_back_button'>")
                }
                let time = response[count].departs_at.substring(11, 16);
                time += " - ";
                time += response[count].arrives_at.substring(11, 16);
                find_airline(response[count].airline_id, k, time, "#general_back_", destination, departure);

                $.ajax(root_url + "planes/" + response[count].plane_id, {
                  type: "GET",
                  xhrFields: {withCredentials: true},
                  success: (r) =>{
                    //alert(r);
                    planeResult = r.name;
                    //alert(result);
                   //alert(planeResult);
                  },
                  error: ()=>{
                    alert("Can't find such plane info");
                    //$(cname+count).remove();
                  }
                });
                addDetails(response[count],'#result_back_'+k,k,destination,departure,dname,aname,date_back);
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
  if (k==0){
    $(".results_back").append("<div class = 'error_m'>Sorry, no such flights...</div>");
  }

}

 function addDetails(response,id,k,depart, arrival, dname, aname, date){
   let time = response.departs_at.substring(11, 16);
   // response[count] single flight
   // add select buttons
   let dateTime = "Date: " + date;
   let departTime = 'Departure Time: '+ response.departs_at.substring(11,16);
   let arrTime = 'Arrival Time: '+ response.arrives_at.substring(11,16);
   let flightNumber = 'Flight Number: ' + response.number;
   let depart1 = 'Departure Airport: ' + dname + " (" + depart + ")";
   let destin = 'Destination Airport: '+ aname + " (" + arrival + ")";
   let departHour = parseInt(response.departs_at.substring(11,13))*60;
   let departMin = parseInt(response.departs_at.substring(14,16))
   let t1 = departHour + departMin;
   let arriveHour = parseInt(response.arrives_at.substring(11,13))*60;
   let arriveMin = parseInt(response.arrives_at.substring(14,16))
   let t2 = arriveHour + arriveMin;
   let t3 = ((t2 -t1)/60.00);


   //alert(planeId);
   // if it's a negative number, add 24 hours
   if (t3<0){
     //alert(t3);
     t3 = t3 + 24.00;
     //alert(t3)
     t3.toFixed(2);
   }

   t3 = t3.toFixed(2);
   let planeId = response.plane_id;


   //alert('wow ' + planeId);
   //findPlaneInfo(planeId);
   //alert(planeResult);
   //let planeInfo = 'Plane name: '+ planeResult;
   //alert('wow' + findPlaneInfo(planeId));
   let timeLast = 'Time on the air: '+ t3 + ' Hours';

   let detailDiv = $('<div class="details" id="details_'+k+'" ></div>')
   $(id).append(detailDiv);
   //findPlaneInfo(planeId,'details_'+k);
   let dateDiv = $('<div>'+dateTime+'</div>');
   let departTimeDiv = $('<div>'+departTime+'</div>');
   let arrivalTimeDiv = $('<div>'+arrTime+'</div>');
   let flightNumberDiv = $('<div>'+flightNumber+'</div>');
   let departAirDiv = $('<div>'+depart1+'</div>');
   let destinAirDiv = $('<div>'+destin+'</div>');
   let timeLastDiv = $('<div>'+timeLast+'</div>');
   //let planeDiv = $('<div>'+ haha +'</div>');

   findPlaneInfo(planeId,'#details_'+k, id);

   //detailDiv.append(planeDiv);
   detailDiv.append(dateDiv);
   detailDiv.append(departTimeDiv);
   detailDiv.append(arrivalTimeDiv);
   detailDiv.append(flightNumberDiv);
   detailDiv.append(departAirDiv);
   detailDiv.append(destinAirDiv);
   detailDiv.append(timeLastDiv);
   detailDiv.hide();

 }

 //toggle details
 this.showDetails = function(e){
   let parent = $(e.currentTarget).parent().parent();
   parent.find($(".details")).toggle();
 }

 //recording flight_id of every change on input radio
 this.selectFlight_go = function(flight_id){
   selected_go = flight_id;
 }

  //recording flight_id of every change on input radio
 this.selectFlight = function(flight_id){
   selected = flight_id;
 }

  //recording flight_id of every change on input radio
 this.selectFlight_back = function(flight_id){
   selected_back = flight_id;
 }

 function findPlaneInfo(planeID,id, parentId){
   $.ajax(root_url + "planes/" + planeID, {
     type: "GET",
     xhrFields: {withCredentials: true},
     success: (r) =>{
       //alert(r);
       //when(r.name)
       planeResult = r.name;
       //alert(planeResult);
       $(parentId).find(id).append('<div>Plane: '+planeResult+'</div> ');

       //alert('jerry')
       //alert(result);
      //alert(planeResult);
     },
     error: ()=>{
       alert("Can't find such plane info");
       //$(cname+count).remove();
     }
   });
 }

 //post instance with date and flight id for oneway trip
 this.buyOneway = function(){
  //  "instance": {
  //   "flight_id": 1,
  //   "date":      "2018-12-21"
   var instance = {"instance": {
     "flight_id" : selected,
     "date": date_go
     }
   };
   var instanceId_array = [];
   $.ajax(root_url + "instances", {
     type: "POST",
     xhrFields: {withCredentials: true},
     data: instance,
     async: false,
     success: (response) => {
       instanceId_array.push(response.id);
     },
     error: () => {
       alert("Please check your internet connection.");
     }
   });
   console.log(selected);
   console.log(instanceId_array);

 }

 //post two instances (go and back) for round trip
 this.buyRoundtrip = function(){
   var instance_go = {"instance": {
     "flight_id" : selected_go,
     "date": date_go
     }
   };
   var instanceId_array = [];
   $.ajax(root_url + "instances", {
     type: "POST",
     xhrFields: {withCredentials: true},
     data: instance_go,
     async: false,
     success: (response) => {
       instanceId_array.push(response.id);
     },
     error: () => {
       alert("Please check your internet connection.");
     }
   });
   var instance_back = {"instance": {
     "flight_id" : selected_back,
     "date": date_back
     }
   };
   $.ajax(root_url + "instances", {
     type: "POST",
     xhrFields: {withCredentials: true},
     data: instance_back,
     async: false,
     success: (re) => {
       instanceId_array.push(re.id);
     },
     error: () => {
       alert("Please check your internet connection.");
     }
   });
   console.log(selected_go, selected_back);
   console.log(instanceId_array);
 }
