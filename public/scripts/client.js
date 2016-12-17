$(document).ready(function() {
    // Add event handlers
    getTasks();
    enable();
});

function enable() {
    // Set up event handlers
    $('#addTodoButton').on('click', addTask);
}

// GET from server
function getTasks() {
    $.ajax({
        url: '/todos',
        type: 'GET',
        success: function(response) {
            console.log(response);
            displayTasks(response);
        },
        error: function(error) {
            console.log("AJAX error:", error);
        }
    });
}

// POST to server
function addTask() {
    var name = $('#nameIn').val();
    var description = $('#descriptionIn').val();
    var objectToSend = {
        name: name,
        description: description
    };
    // POST object
    $.ajax({
        url: '/todos',
        type: 'POST',
        data: objectToSend,
        success: function(response) {
            getTasks();
        },
        error: function(error) {
            console.log("AJAX error:", error);
        }
    });
}

function displayTasks(taskArray) {
    var htmlString = '<table><thead><td>Name</td><td>Description</td>';
    htmlString += '<td>Status</td></thead>';
    taskArray.forEach(function(task) {
        htmlString += '<tr data-id="' + task.id + '">';
        htmlString += '<td>' + task.name + '</td>';
        htmlString += '<td>' + task.description + '</td>';
        htmlString += '<td><button class="status-button">';
        if (task.complete) {
            htmlString += 'Complete';
        } else {
            htmlString += 'Incomplete';
        }
        htmlString += '</button></td>';
        htmlString += '<td><button class="delete-button">Delete</button></td>';
    });
    htmlString += '</table>';
    $('#outputs').html(htmlString);
}
