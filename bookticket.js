var root = "http://comp426.cs.unc.edu:3001/";
var root_url = "http://comp426.cs.unc.edu:3001/";

//clean all after click book button, build_purchase_interface

$(document).ready(function () {
    $(".search").click(function () {
        build_purchase_interface();
    });
});

// go to my trip page
$(document).ready(function () {
    $(".mytrips").click(function () {
        build_mytrip_interface();
    });
});




var build_purchase_interface = function () {
    let nav = $('<div class="nav_div"> </div>');
    nav.append('<button class = "home"> Home </button>')
    nav.append('<button class="myTrips">My Trips</button>')
    nav.append('<button class="log">Log In</button>')


    let body = $('body');
    body.empty();

    let firstName = $('<div class="firstName">First Name: </div>');
    firstName.append('<input type="text" name="firstName" id="firstName" placeholder="Put your first name" required></br>');


    let middleName = $('<div class="middleName">Middle Name: </div>');
    middleName.append('<input type="text" name="middleName" id="middleName" placeholder="Put your middle name"></br>');

    let lastName = $('<div class="lastName">Last Name: </div>');
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

    let purchaseBtn = $('<input type="button" name="purchase" class = "unpurchased" value="Purchase"></input>');



    // let dataticket = {};
    // let ticketData = {};
    // ticketData["first_name"] = $("#firstName").val();
    // dataticket["ticket"] = ticketData;

    $(purchaseBtn).click(function () {

        $(this).removeClass('unpurchased').addClass('purchased');

        console.log({
            "ticket": {
                "first_name": $("#firstName").val(),
                "middle_name": $("#middleName").val(),
                "last_name": $("#lastName").val(),
                "age": parseInt($("#age").val(), 10),
                "gender": $("input[name='gender']:checked").val(),
                "is_purchased": true,
                //"price_paid": "290.11",
                "instance_id": parseInt($("#instanceID").val(), 10),
                "seat_id": parseInt($("#seatID").val(), 10),

            }
        }


        );
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
                    "instance_id": parseInt($("#instanceID").val(), 10),
                    "seat_id": parseInt($("#seatID").val(), 10),
                }
            },
            success: function (build_mytrip_interface) {
                alert("Purchased!");
            }


        });

    });



    //numberonly not working
    $(".numberonly").on("keypress keyup blur", function (event) {
        $(this).val($(this).val().replace(/[^\d].+/, ""));
        if ((event.which < 48 || event.which > 57)) {
            event.preventDefault();
        }
    });




    $('body')
        .append(nav)
        .append('<div>search result</div')//show search result

        .append('<form id="myInfo"></form>');

    $('#myInfo')

        .append(firstName)
        .append(middleName)
        .append(lastName)
        .append(age)
        .append(gender)
        .append(instanceID)
        .append(seatID)
        .append(purchaseBtn)

}
//my trip page
var build_mytrip_interface = function () {
    alert("buildmytrip");
    let nav = $('<div class="nav_div"> </div>');
    nav.append('<button class = "home"> Home </button>')
    nav.append('<button class="myTrips">My Trips</button>')
    nav.append('<button class="log">Log In</button>')

    let body = $('body');
    body.empty();

    let mytickets = $('<div class="mytickets">My tickets: </div>');

    $.ajax(root_url + 'tickets',
        {
            type: 'GET',
            xhrFields: { withCredentials: true },
            data: dataticket,
            success: function (build_mytrip_interface) {
                alert("Purchased!");
            }


        });







    $('body')
        .append(nav);

}