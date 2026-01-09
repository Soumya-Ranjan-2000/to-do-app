function LoadView(url){
    $.ajax({
        method :'get',
        url: url,
        success : (response)=>{
            $("section").html(response);
        }
    });

}

// jQuery Load Action
$(() => {

    if($.cookie('uname')){
        LoadDashBoard();
    }else{
        LoadView('./home.html');
    }

    $(document).on('click', "#home-register-button", () => {
        LoadView('./register.html');
    });

    $(document).on('click', "#home-login-button", () => {
        LoadView('./login.html');
    });

    $(document).on('click', '#btn-home', () => {
        LoadView('./home.html');
    });

    // ✅ Username Availability Check
    $(document).on('keyup', '#txtUserName', () => {
        $.ajax({
            method: 'get',
            url: 'http://localhost:4040/users',
            success: (users) => {

                let entered = $("#txtUserName").val();
                let taken = false;

                for (let user of users) {
                    if (user.username === entered) {
                        taken = true;
                        break;
                    }
                }

                if (taken) {
                    $("#lblUserError").html('User Name Taken - Try Another').css("color", "red");
                } else {
                    $("#lblUserError").html('User Name Available').css("color", "green");
                }
            }
        });
    });

    // ✅ Password Verification
    $(document).on('keyup', '#txtPassword', () => {

        let pwd = $("#txtPassword").val();
        let regex = /^[A-Z][A-Za-z0-9@]{7,}$/;

        if (regex.test(pwd)) {
            $("#lblPasswordError").html("Strong Password").css("color", "green");
        } else {
            $("#lblPasswordError").html("Password must start with uppercase, be 8+ chars, and only contain letters, numbers, or @").css("color", "red");
        }
    });

    $(document).on('click', '#btnRegister', () => {

        let newUser = {
            username: $("#txtUserName").val(),
            password: $("#txtPassword").val(),
            email: $("#txtEmail").val()
        };

        // Step 1: Check if user already exists
        $.ajax({
            method: 'get',
            url: 'http://localhost:4040/users',
            success: (users) => {

                let exists = false;

                for (let u of users) {
                    if (u.username === newUser.username && u.password === newUser.password) {
                        exists = true;
                        break;
                    }
                }

                if (exists) {
                    $("#lblUserError").html("User already exists — you cannot register again").css("color", "red");
                    return;
                }

                // Step 2: Register new user
                $.ajax({
                    method: 'post',
                    url: 'http://localhost:4040/users',
                    contentType: "application/json",
                    data: JSON.stringify(newUser),
                    success: () => {
                        alert("Registered Successfully");
                        LoadView('./login.html');
                    }
                });

            }
        });

    });

    // Load DashBoard 

    function LoadDashBoard(){
        $.ajax({
                        method : 'get',
                        url : './dashboard.html',
                        success : (response) =>{
                            $("section").html(response);
                            $("#active-user").html($.cookie('uname'));
                            $.ajax({
                                method : 'get',
                                url : 'http://localhost:4040/appointments',
                                success : (appointments)=>{
                                    var results = appointments.filter(appointment=> appointment.username===$.cookie('uname'));
                                    results.map(appointment=>{
                                        $(`
                                            <div class="alert alert-success mx-2" style="width: 250px; height: 200px;">
                                                <h3>${appointment.title}</h3>
                                                <p>${appointment.description}</p>
                                                <div class="bi bi-calendar"> ${appointment.date}</div>
                                                <div class="my-2">
                                                    <button data-bs-target="#edit-appointment" data-bs-toggle="modal" id="btn-edit" value=${appointment.id} class="bi bi-pen-fill btn btn-warning"></button>
                                                    <button id="btn-delete" value=${appointment.id} class="bi bi-trash-fill btn btn-danger mx-2"></buttoon>
                                                    
                                                </div>
                                            </div>
                                        `).appendTo("#appointment-cards")
                                    })
                                    
                                }
                            })
                        }
                    })

    }


    // Login Click
   $(document).on('click','#btnLogin', ()=>{
    $.ajax({
        method : 'get',
        url : 'http://localhost:4040/users',
        success : (users)=>{
            var user = users.find(item => item.username === $("#txtUserName").val());
            if(user){
                if(user.password === $("#txtPassword").val()){
                    $.cookie('uname',$("#txtUserName").val(),{expires:2});
                    LoadDashBoard();


                }else{
                    alert('Invalid Password');
                }
            }else{  
                alert('Invalid User Name');
            }
        }
    })
})

// Signout Click
$(document).on('click', '#btn-signout',()=>{
    $.removeCookie('uname');
    LoadView('./home.html');
})


// Add Appointment Click


$(document).on('click','#btn-add', ()=>{

    var appointment = {
        title : $('#appointment-title').val(),
        description : $('#appointment-description').val(),
        date : $('#appointment-date').val(),
        username : $.cookie('uname')
    }

    $.ajax({
        method : 'post',
        url : 'http://localhost:4040/appointments',
        data : JSON.stringify(appointment),
    })

    
    
})

// Delete Appointment 

$(document).on('click', '#btn-delete', (e)=>{
    var flag = confirm(`Are You Sure?\nWant to Delete?`);
    if(flag===true){
        $.ajax({
        method : 'delete',
        url : `http://localhost:4040/appointments/${e.target.value}`
        }) ;
        LoadDashBoard();
    }

})

// Edit Click
 $(document).on('click','#btn-edit', (e)=>{
    $.ajax({
        method : 'get',
        url : `http://localhost:4040/appointments/${e.target.value}`,
        success : (appointment) =>{
            $("#edit-appointment-id").val(appointment.id);
            $("#edit-appointment-title").val(appointment.title);
            $('#edit-appointment-description').val(appointment.description);
            $("#edit-appointment-date").val(appointment.date);
        }
    })
 })

 // Update and Save Appointment 
 $(document).on('click', '#btn-save', ()=>{
        var appointment = {
            id : $("#edit-appointment-id"),
            title : $('#edit-appointment-title').val(),
            description : $('#edit-appointment-description').val(),
            date : $('#edit-appointment-date').val(),
            username : $.cookie('uname')
    }

    $.ajax({
        method : 'put',
        url : `http://localhost:4040/appointments/${$("#edit-appointment-id").val()}`,
        data : JSON.stringify(appointment)
    });

    LoadDashBoard();
 })


});



