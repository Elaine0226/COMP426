var root = "http://comp426.cs.unc.edu:3001/";
var root_url = "http://comp426.cs.unc.edu:3001/";
var departure, destination;
var search_flight = function() {
  var departure = $("#depature").val();
  var destination = $("#destination").val();
  var departure_array, arrival_array;
  $.ajax(root_url + "airports?filter[code]=" + departure, {
    type: "GET",
    xhrFields: {withCredentials: true},
    success: (de_response) => {
      if (de_response){
        departure_array = de_response;
        $.ajax(root_url + "airports?filter[code]=" + destination, {
          type: "GET",
          xhrFields: {withCredentials: true},
          success: (ar_response) => {
            if (ar_response){
              arrival_array = ar_response;
              result_page(departure_array, arrival_array, departure, destination);
            } else {

            }
          },
          error: () =>{
            alert("Please check your internet connection!");
          }
        });
      } else {

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
      $.ajax(root_url + "flights?filter[departure_id]=" + desparture_array[i].id + "&filter[arrival_id]=" + arrival_array[j].id, {
        type: "GET",
        xhrFields: {withCredentials: true},
        success: (response) => {
          if (response){
            for (var count = 0; count < response.length; count++){
              $(".result-container").append("<div class = 'result' id = 'result_'" + count + " ></div>");
              $("#result_" + count).append("<div class = 'flight_time' id = 'flight_time_'" + count + " >" + response[count].departs_at + "-" + response[count].arrives_at + "</div>");
              $("#result_" + count).append("<div class = 'flight_places id = 'flight_places_" + count + " >" + departure + "->" + destination + "</div>");
            }
          } else {

          }
        },
        error: () =>{
          alert("Please check your internet connection!");
        }
      });
    }
  }
}

/*
$(document).ready(()=>{
  let userName = changhao;
  let pw = 730086729;
  $.ajax(root+'sessions',{
  type:'POST',
  xhrFields: {withCredentials: true},
  data:{
    user:{
    username:userName,
    password:pw
  }
  },
  success:(r)=>{
    if(r.status){
      alert('Login Success!')
      $('#msg').html("Success!");
       showMe();
    }else{
      $('#msg').html("It seems that your password is wrong. Please try again");
    }
  },
  error: () => {
      alert('XMLHttpRequest failed. Please check your network');
      //$('#msg').append('<button'+'id=button_'+allQuestions[i]+'>'submit'</button>');
  }


  });
*/
