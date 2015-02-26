$(function() {

    var headerForm = $('#headerForm');
    var contactForm = $('#contactForm');

    // Add American phone number rule to verify
    $.verify.addRules({
        usNumber: function(r) {
            var stripped = r.val().replace(/[\(\)\.\-\ ]/g, '');

            if (r.val() === "") {
                return "You didn't enter a phone number.";
            } else if (isNaN(parseInt(stripped))) {
                return "The phone number contains illegal characters.";
            } else if (!(stripped.length == 10)) {
                return "The phone number is the wrong length. Make sure you included an area code.";
            }
            return true;
        }
    });

    // Hack to get the submit button to stop sending twice
    var isSending = false;

    $.verify({
        beforeSubmit: function (form, result) {
            if (!isSending && result){
                isSending = true;
                sendContactEmail(form);
            }
            return false;
        }
    });

    var sendContactEmail = function (event) {
        var nameField = event.target.name;
        var emailField = event.target.email;
        var phoneField = event.target.phone;
        var messageField = event.target.message;
        var firstname = nameField.value;

        $.ajax({
            url: "https://formkeep.com/f/b1098a43ffd3",
            type: "POST",
            data: {
                name: nameField.value,
                phone: phoneField.value,
                email: emailField.value,
                message: (messageField) ? messageField.value : ""
            },
            cache: false,
            success: function () {
                // Success message
                $('#successContactModal').modal();

                //clear all fields
                headerForm.trigger("reset");
                contactForm.trigger("reset");
                isSending = false;
            },
            error: function () {
                // Fail message
                $('#success').html("<div class='alert alert-danger'>");
                $('#success > .alert-danger').html("<button type='button' class='close' data-dismiss='alert' aria-hidden='true'>&times;")
                    .append("</button>");
                $('#success > .alert-danger').append("<strong>Sorry " + firstname + ", it seems that my mail server is not responding. Please try again later!");
                $('#success > .alert-danger').append('</div>');

                //clear all fields
                headerForm.trigger("reset");
                contactForm.trigger("reset");
                isSending = false;
            }
        });
    };

    var stopDefault = function (event) {
        event.preventDefault();
    };

    headerForm.submit(stopDefault);
    contactForm.submit(stopDefault);

    $("a[data-toggle=\"tab\"]").click(function(e) {
        e.preventDefault();
        $(this).tab("show");
    });
});


/*When clicking on Full hide fail/success boxes */
$('#name').focus(function() {
    $('#success').html('');
});
