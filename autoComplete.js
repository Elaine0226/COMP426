root_url = "http://comp426.cs.unc.edu:3001/";
function convertAirport(airport){
  let data;
  $.ajax(root_url + '/airports?filter[name]='+airport,{
    type:'GET',
    xhrFields: {withCredentials: true},
    async: false,
    success:(response)=>{
     data = response;
     //return data[0].code;
    }
  })
  if (data.length == 0){
    return airport.toUpperCase();
  } else{
    return data[0].code;
  }
}

   let airport = [];
   //let airportCode = [];
   $.ajax(root_url + 'airports',{
     type:'GET',
     xhrFields: {withCredentials: true},
     success:(response)=>{

       //console.log(data);

       let data = response;
       //console.log(data);
       for(let i = 0;i<data.length;i++){
         if(!airport.includes(data[i].name)){
         airport.push(data[i].name);}

       }

       $("#departure").autocomplete({
        source: function(request, response) {
        var results = $.ui.autocomplete.filter(airport, request.term);

        response(results.slice(0, 7));
    }
});
       $("#destination").autocomplete({
       source: function(request, response) {
       var results = $.ui.autocomplete.filter(airport, request.term);

       response(results.slice(0, 7));
}
});

       //$('#departure').autocomplete( maxResults: 5,{source:airport});

       //$('#departure').autocomplete( maxResults: 5,{source:airport});
      //$('#destination').autocomplete( maxResults: 5,{source:airport});

     }

   });
