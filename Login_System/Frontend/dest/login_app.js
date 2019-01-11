
// Validation before form submission
$(document).ready(function(){
    
var event = document.getElementById('submit');
if(event){
    event.addEventListener("click",function(event){
        Validate(event);
    });
}

var username = document.getElementById('username');
var password = document.getElementById('password');

var name_error = document.getElementById('name-error');
var pass_error = document.getElementById('pass-error');

// Validate Function
function Validate(){
    var isValid = true;

    if(username.value == ""){
        username.classList.add('error');
        name_error.classList.add('error-field');
        name_error.innerHTML = "Username is required";
        isValid = false;
    } else {
        username.classList.remove('error');
        name_error.innerHTML = "";
        name_error.classList.remove('error-field');
    }

    if(password.value.length == ""){
        password.classList.add('error');
        pass_error.classList.add('error-field');
        pass_error.innerHTML = "Password is required";
        isValid = false;
        
    } else {
        password.classList.remove('error');
        pass_error.classList.remove('error-field');
        pass_error.innerHTML = "";
    }
return isValid;
}

//Ajax Call to store and fetch form


    var user = JSON.parse(sessionStorage.getItem('user'));
    if(user) {
        location.href = "homepage.html";
        return;
    } 

    $("[name='login-form']").submit(function(e){
        e.preventDefault();
        if(Validate()) {
            $.ajax({
                url:'http://localhost:3002/login',
                type:'post',
                crossDomain: true,
                data:$("[name='login-form']").serialize(),
                success:function(resp){
                    var resultData = JSON.parse(resp);
                    console.log(resultData);

                    if(resultData.FLAG === 'USER_EXIST'){
                        sessionStorage.setItem('user',JSON.stringify(resultData.user));
                        window.location.href = "homepage.html";
                    } else if(resultData.FLAG === 'USER_MISMATCH'){
                        alert('Username or password is incorrect');
                    } else if(resultData.FLAG === 'USER_NOT_EXIST'){
                        alert('Please Register/Signup');
                    } else
                        alert("Contact your admin");
                }
            });
        }
    });
});