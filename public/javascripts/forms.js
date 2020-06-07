$('#cnfpassword, #password').blur(function () {
    var pwd = $('#password').val();
    var cnfpwd = $('#cnfpassword').val();
    if (pwd != cnfpwd) {
        $('.pwd-match').text("Passwords do not match.");
        $('.pwd-match').css({ 'color': 'red' });
        $('#registerBtn').attr("disabled", "disabled");
    } else {
        $('.pwd-match').text("Passwords match.");
        $('.pwd-match').css({ 'color': 'green' });
        $('#registerBtn').removeAttr("disabled");
    }
    if (pwd != '' || cnfpwd != '') {
        $('.pwd-match').show();
    }

});

