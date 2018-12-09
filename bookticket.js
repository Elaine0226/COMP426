var root = "http://comp426.cs.unc.edu:3001/";
var root_url = "http://comp426.cs.unc.edu:3001/";



var build_purchase_interface = function (instanceId_array) {
    let nav = $('<div class="nav_div"> </div>');
    nav.append('<button class = "home" onclick="home()"> Home </button>')
    nav.append('<button class="myTrips" onclick = "myTrips()">My Trips</button>')
    // nav.append('<button class="log">Log In</button>')


    let body = $('body');
    body.empty();



    let firstName = $('<div class="firstName"> First Name: </div>');
    firstName.append('<input type="text" name="firstName" id="firstName" placeholder="Put your first name" required></br>');

    let middleName = $('<div class="middleName"> Middle Name: </div>');
    middleName.append('<input type="text" name="middleName" id="middleName" placeholder="Put your middle name"></br>');

    let lastName = $('<div class="lastName"> Last Name: </div>');
    lastName.append('<input type="text" name="lastName" id="lastName" placeholder="Put your last name" required></br>');

    let age = $('<div class="age">Age: </div>');
    age.append('<input type="text" name="numeric" id = "age" class="numberonly" placeholder = "Your age" required>');

    let gender = $('<div class="gender">Gender: </div>');
    gender.append('<label><input type="radio" name="gender" value="male" required> Male</label> ')
    gender.append('<label><input type="radio" name="gender" value="female" required >Female</label>')

    let instanceID = $('<div class="instanceID">Instance ID: </div>');
    instanceID.append('<input type="text" name="instanceID" id="instanceID" class = "numberonly" placeholder="Put your instance ID"></br>')

    let seatID = $('<div class="seatID">Seat ID: </div>');
    seatID.append('<input type="text" name="seatID" id="seatID" class = "numberonly" placeholder="Put your seat ID"></br>')

    let email = $('<div class="email">Email: </div>');
    email.append('<input type="text" name="email" id="email" class = "email" placeholder="Email address"></br>')


    let purchaseBtn = $('<input type="button" name="purchase" class = "unpurchased" value="Purchase"></input>');




    $(purchaseBtn).click(function () {

        $(this).removeClass('unpurchased').addClass('purchased');

        for (let instanceId of instanceId_array) {
            $.ajax(root_url + 'itineraries', {
                type: 'POST',
                xhrFields: { withCredentials: true },
                data: {
                    "itinerary": {
                        "email": $("#email").val(),
                    }
                },
                success: {
                }

            });

            $.ajax(root_url + 'tickets', {
                type: 'POST',
                xhrFields: { withCredentials: true },
                data: {
                    "ticket": {
                        "first_name": $("#firstName").val(),
                        "middle_name": $("#middleName").val(),
                        "last_name": $("#lastName").val(),
                        "age": parseInt($("#age").val(), 10),
                        "gender": $("input[name='gender']:checked").val(),
                        "is_purchased": true,
                        "instance_id": instanceId.id, //roundtrip post两个instanceid
                        "seat_id": parseInt($("#seatID").val(), 10),
                    }
                },
                success: function (build_mytrip_interface) {
                    console.log(instanceId.id);
                    alert("Purchased!");
                }


            });


        }


    });




    //print search result instance
    let searchResults = $('<div class="searchResults"></div>');
    $(searchResults).append('<div class = "ticket_just_booked">Purchase Ticket in 24 Hours</div>');

    for (var i = 0; i < instanceId_array.length; i++) { //change to array.length
        //var i = 0;
        var instanceflightID = instanceId_array[i].flight_id;
        var flightdate = instanceId_array[i].date;


        $.ajax(root_url + 'flights/' + instanceflightID, {
            type: 'GET',
            xhrFields: { withCredentials: true },
            dataType: 'json',
            success: (response) => {

                var flightinfo = $('<div class="flightinfopurchase"></div>');
                //console.log(response.arrives_at.substring(0, 10));

                flightinfo
                    .append("Departure: " + flightdate + " " + response.departs_at.substring(11, 16)
                        + "  | Arrival: " + flightdate + " " + response.arrives_at.substring(11, 16) + "</br>");

                var departureid = response.departure_id;
                var departureairport;
                var arrivalairport;

                $.ajax(root_url + 'airports/' + departureid, {
                    type: 'GET',
                    xhrFields: { withCredentials: true },
                    dataType: 'json',
                    success: (response) => {
                        departureairport = response.name;

                    }
                })

                var arrivalid = response.arrival_id;

                $.ajax(root_url + 'airports/' + arrivalid, {
                    type: 'GET',
                    xhrFields: { withCredentials: true },
                    dataType: 'json',
                    success: (response) => {
                        arrivalairport = response.name;
                        flightinfo.append("Depart at: " + departureairport + "  |  ")
                        flightinfo.append("Arrive at: " + arrivalairport);
                    }
                })


                searchResults.append(flightinfo);

            }
        }
        );


    }






    $('body')
        .append(nav)
        .append("</br>")
        .append("</br>")
        .append(searchResults)
        .append("</br>")
        .append('<form id="myInfo"></form>');

    $('#myInfo')
        .append(firstName)
        .append(middleName)
        .append(lastName)
        .append(age)
        .append(gender)
        //.append(instanceID)
        .append(seatID)
        .append(email)
        .append(purchaseBtn);



}




//my trip page
var build_mytrip_interface = function () {
    let body = $('body');
    body.empty();

    let nav = $('<div class="nav_div"> </div>');
    nav.append('<button class = "home" onclick="home()">Home</button>')

    let mytripbtn = $('<button class = "myTrips" onclick = "myTrips()">My Trips</button>');
    nav.append(mytripbtn)

    $('body')
        .append(nav)
    //.append("My Purchased Trips:");


    let mytickets = $('<div class="mytickets">My tickets: </div>');
    let searchResults = $('<div class="searchResults"> </div>');


    let mytrip_page = $('<div class="mytrip_page"></div>');



    $(document).ready(function () {

        $.ajax(root_url + 'tickets', {
            type: 'GET',
            xhrFields: { withCredentials: true },
            dataType: 'json',
            success: (response) => {
                for (let resticket of response) {
                    resticket_instance = resticket.instance_id;

                    $.ajax(root_url + 'instances/' + resticket_instance, {
                        type: 'GET',
                        xhrFields: { withCredentials: true },
                        dataType: 'json',
                        success: (response) => {

                            var instanceflightID = response.flight_id;
                            var instanceid = response.id;
                            var flightdate = response.date;

                            let flightinfo = $('<div class="flightinfo"></div>');
                            let personalinfo = $('<div class="personalinfo"> </div>');


                            $.ajax(root_url + 'flights/' + instanceflightID, {
                                type: 'GET',
                                xhrFields: { withCredentials: true },
                                dataType: 'json',
                                success: (response) => {


                                    flightinfo.append("Departure: " + flightdate + " " + response.departs_at.substring(11, 16)
                                        + "  | Arrival: " + flightdate + " " + response.arrives_at.substring(11, 16) + "</br>")

                                    var departureid = response.departure_id;

                                    $.ajax(root_url + 'airports/' + departureid, {
                                        type: 'GET',
                                        xhrFields: { withCredentials: true },
                                        dataType: 'json',
                                        success: (response) => {
                                            var departureairport = response.name;
                                            flightinfo.append("Depart at: " + departureairport + "  |  ")
                                        },
                                        async: false
                                    })

                                    var arrivalid = response.arrival_id;

                                    $.ajax(root_url + 'airports/' + arrivalid, {
                                        type: 'GET',
                                        xhrFields: { withCredentials: true },
                                        dataType: 'json',
                                        success: (response) => {
                                            var arrivalairport = response.name;
                                            flightinfo.append("Arrive at: " + arrivalairport)
                                        },
                                        async: false
                                    })
                                    $.ajax(root_url + 'tickets?filter[instance_id]=' + instanceid,
                                        {
                                            type: 'GET',
                                            dataType: 'json',
                                            xhrFields: { withCredentials: true },
                                            success: (response) => {
                                                for (let res of response) {


                                                    $(personalinfo).append("<div>"
                                                        + "Name: " + res.first_name + res.middle_name + " " + res.last_name
                                                        + "     " + "Gender: " + res.gender
                                                        + "     " + "Age: " + res.age + "</br>"
                                                        + "  Instance ID: " + res.instance_id + "<br><br>" + "</div>");
                                                    //+ "  Itinery ID: " + res.itinerary_id + "</br></div>");
                                                }
                                            },
                                            async: false
                                        });

                                    $(mytrip_page)

                                        .append(flightinfo)
                                        .append(personalinfo);
                                    $('body')

                                        .append(mytrip_page);

                                },
                                async: false
                            }
                            );
                            //}
                        }
                    })


                }
            }
        }



        )




    }
    );
}

var myTrips = function () {
    build_mytrip_interface();
}