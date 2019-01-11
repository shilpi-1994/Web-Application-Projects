

$(document).ready(function () {

    var messageReadCount = 0;
    var user = JSON.parse(sessionStorage.getItem('user'));
    if (user) {
        renderHtml(user);
    } else {
        location.href = "index.html";
    }

    $('.delete').on('click', function () {
        if (window.confirm("Do you really want to delete your account?")) {
            $.ajax({
                url: 'http://localhost:3002/removeUser',
                type: 'delete',
                crossDomain: true,
                data: user,

                success: function (resp) {
                    var resultData = JSON.parse(resp);
                    console.log(resultData);
                    sessionStorage.removeItem('user');
                    window.location.href = "index.html";
                }
            });
        } else {
            location.href = "homepage.html";
        }
    });

    $.ajax({
        url: 'http://localhost:3002/messages',
        type: 'get',
        data: {
            "ID": user.ID
        },
        crossDomain: true,
        success: function (resp) {
            var getMessage = JSON.parse(resp);

            if (getMessage && getMessage.messages && getMessage.messages.length > 0) {

                for (var i = 0; i < getMessage.messages.length; i++) {
                    var message = getMessage.messages[i];
                    var isRead = message.MESSAGE_READ;
                    if (isRead === 0) {
                        messageReadCount++;
                    }
                }
                var source   = document.getElementById("message-template").innerHTML;
                var template = Handlebars.compile(source);
                var context = {messages : getMessage.messages};
                var html    = template(context);
                $('.message-box').append(html);

                updateMesgReadCount();

                //To mark messages read on click
                $(".card").on('click', function () {
                    markMessageAsRead($(this));
                });

                //Display sender's profile
                $(".msg-avatar").on('click', function () {
                    displayProfile($(this).parent().parent().data("message-id"));
                });

                //Star button for messages
                $(".fa-star").on('click', function () {
                    $($(this)).css("background", "yellow");
                });

                //Delete messages on click
                $(".fa-trash-alt").on('click', function () {
                    deleteMessage($(this).parent().parent().data("message-id"));
                });

            } else {
                $('.badge').html(0);
            }
        }
    });


    Handlebars.registerHelper('mesgTime', function(dateStr){
        var temp = (new Date() - new Date(Date.parse(dateStr)));
        var time_lapse = Math.round(temp / (1000 * 3600 * 24));
        return time_lapse;
    });

    Handlebars.registerHelper('isMessageRead', function(isRead){
        console.log(isRead);
        return isRead ? 'msg-read' :'';
    });
    

    function markMessageAsRead(mesg) {
        if (mesg.attr("message-read") === "0") {
            $.ajax({
                url: 'http://localhost:3002/messages/update',
                type: 'post',
                data: {
                    "MSG_ID": mesg.data("message-id"),
                    "USER_ID": user.ID
                },
                crossDomain: true,
                success: function (resp) {
                    var mess_flag = JSON.parse(resp);
                    console.log(mess_flag);
                    mesg.attr("message-read", 1);
                    mesg.addClass("msg-read");
                    messageReadCount--;
                    updateMesgReadCount();
                }
            });
        }
    }

    function updateMesgReadCount() {
        $('.badge').html(messageReadCount);
    }

    function deleteMessage(del) {
        $.ajax({
            url: 'http://localhost:3002/messages/update/delete',
            type: 'post',
            data: {
                "MSG_ID": del,
                "USER_ID": user.ID
            },
            crossDomain: true,
            success: function (resp) {
                var mess_flag = JSON.parse(resp);
                $("#" + mess_flag.id).remove();
                console.log(mess_flag);

            }
        });

    }

    // Function to dipslay data on profile card
    function renderHtml(user) {
        $('.card-title').html(user.USERNAME);
        $('.card-image').attr("src", user.PROFILE_PIC);
    }

    // Invalidate session on logout
    $('.logout').on('click', function () {
        if (sessionStorage.getItem('user')) {
            sessionStorage.removeItem('user');
            sessionStorage.removeItem('message_counter');
            location.href = "index.html";
        }
    });

});

    function displayProfile(senderId) {
        console.log(senderId);
        $.ajax({
            url: 'http://localhost:3002/messages/update/display',
            type: 'post',
            data: {
                "MSG_ID": senderId
            },
            crossDomain: true,
            success: function (resp) {
                var display = JSON.parse(resp);
                var source   = document.getElementById("sender-modal-template").innerHTML;
                var template = Handlebars.compile(source);
                var context = { sender: display.user};
                var html    = template(context);
                $(".sender-modal .sender-details").html(html);
            }
        });
    }
