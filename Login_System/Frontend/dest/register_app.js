//Fetch DOM elements

var fname_error = document.getElementById('fname-error');
var lname_error = document.getElementById('lname-error');
var email_error = document.getElementById('email-error');
var phone_error = document.getElementById('phone-error');
var pass_error = document.getElementById('pass-error');
var conpass_error = document.getElementById('conpass-error');
var terms_error = document.getElementById('terms-error');
var checkedBox = document.getElementById('check');


var fname = document.getElementById('fname');
var lname = document.getElementById('lname');
var email = document.getElementById('email');
var phone = document.getElementById('phone');
var password = document.getElementById('password');
var conpass = document.getElementById('conpass');


// Regex to validate input fields

function validateName(name) {
    var check_name = /^([a-zA-Z]){1,35}$/;
    return check_name.test(name);
}

function validateEmail(email) {
    var check_email = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/;
    return check_email.test(email);
}

function validatePhone(phone) {
    var check_phone = /^[0-9 ]{10}/;
    return check_phone.test(phone);
}

function validatePass(password) {
    var check_password = /^[A-Za-z0-9!@#$%^&*()_]{6,20}$/;
    return check_password.test(password);
}

//function to display error messages
function Validation() {
    this.clearError = function (inputEl, errField) {
        inputEl.classList.remove('error');
        errField.classList.remove('error-field');
        errField.innerHTML = "";
    };
    this.setError = function (inputEl, errField, errMsg) {
        inputEl.classList.add('error');
        errField.classList.add('error-field');
        errField.innerHTML = errMsg;
    };
    return this;
}


// Validate function to display error
function validateForm() {

    var isFormValid = true;
    // Firstname validation
    if (!validateName(fname.value)) {
        Validation().setError(fname, fname_error, "Enter firstname correctly");
        isFormValid = false;
    } else {
        Validation().clearError(fname, fname_error);
    }

    // Lastname validation
    if (!validateName(lname.value)) {
        Validation().setError(lname, lname_error, "Enter lastname correctly");
        isFormValid = false;
    } else {
        Validation().clearError(lname, lname_error);
    }

    // Email validation
    if (!validateEmail(email.value)) {
        Validation().setError(email, email_error, "Enter email correctly");
        isFormValid = false;
    } else {
        Validation().clearError(email, email_error);
    }

    // Phone number validation
    if (!validatePhone(phone.value)) {
        Validation().setError(phone, phone_error, "Enter Ph.No correctly");
        isFormValid = false;
    } else {
        Validation().clearError(phone, phone_error);
    }

    //Password Validation
    if (!validatePass(password.value)) {
        Validation().setError(password, pass_error, "Enter password");
        isFormValid = false;
    } else {
        Validation().clearError(password, pass_error);
    }

    if (password.value === conpass.value) {
        Validation().clearError(conpass, conpass_error);
    } else {
        Validation().setError(conpass, conpass_error, "Passwords doesn't match");
        isFormValid = false;

    }

    // Terms and Privacy validation
    if (!checkedBox.checked) {
        terms_error.classList.add('error-field');
        terms_error.innerHTML = 'Please agree Terms of use and Privacy Policy';
        isFormValid = false;
    } else {
        terms_error.classList.remove('error-field');
        terms_error.innerHTML = "";
    }

    return isFormValid;
}

//Ajax Call to store and fetch form
$(document).ready(function () {
    $("[name='myForm']").submit(function (e) {
        e.preventDefault();
        if (validateForm()) {
            $.ajax({
                url: 'http://localhost:3002/register',
                type: 'post',
                crossDomain: true,
                data: $("[name='myForm']").serialize(),
                success: function (resp) {
                    console.log(typeof resp);
                    var resultData = JSON.parse(resp);
                    console.log(resultData);
                    
                    if (resultData.FLAG === 'USER_ALREADY_EXIST') {
                        alert("User profile already exists");
                    } else if (resultData.FLAG === 'ERROR_DB_PROFILE') {
                        alert("Error in profile creation");
                    } else if (resultData.FLAG === 'PROFILE_CREATED') {
                        sessionStorage.setItem('user',JSON.stringify(resultData.user));
                        window.location.href = "homepage.html";
                    } else
                        alert("Contact your admin");
                    }
            });
        }
    });
});