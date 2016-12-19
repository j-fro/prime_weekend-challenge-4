$(document).ready(function() {
    // Add event handlers
    getAllQueries();
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
        error: ajaxError
    });
}

function getPeople() {
    $.ajax({
        url: '/person',
        type: 'GET',
        success: function(response) {
            displayPersonSelect(response);
        },
        error: ajaxError
    });
}

function getAllQueries() {
    $.ajax({
        url: '/combined',
        type: 'GET',
        success: function(response) {
            displayTasks(response.tasks, response.people, response.combined);
        },
        error: ajaxError
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

function displayPersonSelect(personArray) {
    var htmlString = '';
    for (var i = 0; i < personArray.length; i++) {
        htmlString += '<option value="' + personArray[i].id + '">';
        htmlString += personArray[i].name + '</option>';
    }
    $('.person-select').html(htmlString);
}

function createPersonSelect(personArray) {
    var htmlString = '<select>';
    for (var i = 0; i < personArray.length; i++) {
        htmlString += '<option value="' + personArray[i].id + '">';
        htmlString += personArray[i].name + '</option>';
    }
    htmlString += '</select>';
    return htmlString;
}

function displayTasks(taskArray, personArray, combinedArray) {
    $('#taskOutputs').html('');
    var selectText = createPersonSelect(personArray);
    taskArray.forEach(function(task) {
        var htmlString = '<div class="task" id="task-' + task.id +
            '" data-id="' + task.id + '"><p>' + task.name + selectText +
            '<button class="add-person-button">Add to Task</button>' +
            '<button class="status-button"></button>' +
            '<button class="delete-button">Delete</button>';
        // Filter the array combining people and tasks to just the current task
        var filteredArray = combinedArray.filter(function(item) {
            console.log(item);
            return item.task_id === task.id;
        });
        console.log('Filtered array:', combinedArray);
        // Add all people who are linked to the current task
        filteredArray.forEach(function(person) {
            htmlString += '<li id="task-"' + task.id + '-person-' + person.person_id +
                '">' + person.person_name + '</li>';
        });
        $('#taskOutputs').append(htmlString);
        if (task.complete) {
            $('#taskOutputs').find('#task-' + task.id).find('.status-button').text('Complete');
        } else {
            $('#taskOutputs').find('#task-' + task.id).find('.status-button').text('Incomplete');
        }
    });
}

function ajaxError(error) {
    console.log('AJAX error:', error);
}
