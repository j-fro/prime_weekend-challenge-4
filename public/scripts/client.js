$(document).ready(function() {
    // Add event handlers
    enable();
});

function enable() {
    // Set up event handlers
}

// GET from server
function getData() {
    $.ajax({
        url: '/',
        type: 'GET',
        success: function(response) {
            // Process results
        },
        error: function(error) {
            console.log("AJAX error:", error);
        }
    });
}

// POST to server
function postData() {
    // Build new object
    var objectToSend = {};
    // POST object
    $.ajax({
        url: '/',
        type: 'POST',
        data: objectToSend,
        success: function(response) {
            // Process results
        },
        error: function(error) {
            console.log("AJAX error:", error);
        }
    });
}
