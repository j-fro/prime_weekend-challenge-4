$(document).ready(function() {
    // Add event handlers
    getTasks();
    enable();
});

function enable() {
    // Set up event handlers
    $('#addTodoButton').on('click', addTask);
    $(document).on('click', '.status-button', completeTask);
    $(document).on('click', '.delete-button', deleteTask);
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
            // Clear inputs
            $('#nameIn').val('');
            $('#descriptionIn').val('');
            getTasks();

        },
        error: function(error) {
            console.log("AJAX error:", error);
        }
    });
}

function completeTask() {
    // Set status to false if complete, true if incomplete
    var status = $(this).text() === 'Incomplete';
    $(this).toggleClass('completed-task');
    var id = $(this).parent().parent().data('id');
    var objectToSend = {
        id: id,
        complete: status
    };
    console.log(objectToSend);
    // PUT to the Server
    $.ajax({
        url: '/todos',
        type: 'PUT',
        data: objectToSend,
        success: function(response) {
            console.log(response);
            getTasks();
        },
        error: function(error) {
            console.log("AJAX error:", error);
        }
    });
}

function deleteTask() {
    var id = $(this).parent().parent().data('id');
    if (confirm('Are you sure you want to delete "' + $(this).parent().parent().children().eq(1).text() + '"?')) {
        $.ajax({
            url: '/todos',
            type: 'DELETE',
            data: {
                id: id
            },
            success: function(response) {
                console.log(response);
                getTasks();
            },
            error: function(error) {
                console.log("AJAX error:", error);
            }
        });
    }
}

function displayTasks(taskArray) {
    console.log('displaying', taskArray);
    var htmlString = '<table><thead><td></td><td>Name</td><td>Description</td>';
    var counter = 1;
    htmlString += '<td>Status</td></thead>';
    taskArray.forEach(function(task) {
        htmlString += '<tr data-id="' + task.id + '"';
        if (task.complete) {
            htmlString += ' class="completed-task"';
        }
        htmlString += '><td>' + counter++ + '<td>' + task.name + '</td>';
        htmlString += '<td><button class="status-button">';
        if (task.complete) {
            htmlString += 'Complete';
        } else {
            htmlString += 'Incomplete';
        }
        htmlString += '</button></td>';
        htmlString += '<td><button class="delete-button">Delete</button></td></tr>';
    });
    htmlString += '</table>';
    $('#taskOutputs').html(htmlString);
}
