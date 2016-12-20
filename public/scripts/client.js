$(document).ready(function() {
    // Add event handlers
    getLists();
    getAllQueries();
    enable();
});

function enable() {
    // Set up event handlers
    $('#addTodoButton').on('click', addTask);
    $('#addPersonButton').on('click', addPerson);
    $('#addListButton').on('click', addList);
    $('#lists').on('change', getAllQueries);
    $(document).on('click', '.status-button', completeTask);
    $(document).on('click', '.delete-button', deleteTask);
    $(document).on('click', '.add-person-button', addPersonToTask);
}

function getAllQueries() {
    // Get all tasks, people, and lists
    $.ajax({
        url: '/combined',
        type: 'GET',
        success: function(response) {
            displayFiltered(response);
        },
        error: ajaxError
    });
}

function getLists() {
    $.ajax({
        url: '/list',
        type: 'GET',
        success: function(response) {
            displayListSelect(response);
        },
        error: ajaxError
    });
}

function addTask() {
    // POST object
    console.log($('#lists').val());
    $.ajax({
        url: '/todos',
        type: 'POST',
        data: {
            name: $('#taskNameIn').val(),
            listId: $('#lists').val()
        },
        success: function(response) {
            // Clear input
            $('#taskNameIn').val('');
            getAllQueries();

        },
        error: function(error) {
            console.log("AJAX error:", error);
        }
    });
}

function addPerson() {
    // POST object
    $.ajax({
        url: '/person',
        type: 'POST',
        data: {
            name: $('#personNameIn').val()
        },
        success: function(response) {
            // Clear input
            $('#personNameIn').val('');
            getAllQueries();
        },
        error: function(error) {
            console.log("AJAX error:", error);
        }
    });
}

function addList() {
    // POST object
    $.ajax({
        url: '/list',
        type: 'POST',
        data: {
            name: $('#listNameIn').val()
        },
        success: function(response) {
            // Clear input
            $('#listNameIn').val('');
            getLists();
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
    var id = $(this).parent().data('id');
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
            getAllQueries();
        },
        error: function(error) {
            console.log("AJAX error:", error);
        }
    });
}

function deleteTask() {
    var id = $(this).parent().data('id');
    if (confirm('Are you sure you want to delete "' + $(this).parent().parent().children().eq(1).text() + '"?')) {
        $.ajax({
            url: '/todos',
            type: 'DELETE',
            data: {
                id: id
            },
            success: function(response) {
                console.log(response);
                getAllQueries();
            },
            error: function(error) {
                console.log("AJAX error:", error);
            }
        });
    }
}

function addPersonToTask() {
    var personId = $(this).parent().find('select').val();
    var taskId = $(this).parent().data('id');
    $.ajax({
        url: 'todos/addToPerson',
        type: 'PUT',
        data: {
            taskId: taskId,
            personId: personId
        },
        success: function(response) {
            console.log(response);
            getAllQueries();
        },
        error: ajaxError
    });
}

function displayFiltered(response) {
    console.log('displaying filtered');
    // displayListSelect(response.lists);
    var listId = $('#lists').val();
    console.log('list id:', listId);
    var filteredTasks = response.tasks.filter(function(task) {
        console.log('in filter checking:', task);
        return task.list_id == listId;
    });
    console.log('filtered tasks:', filteredTasks);
    var filteredCombined = response.combined.filter(function(combined) {
        return combined.list_id == listId;
    });
    console.log('filtered combined:', filteredCombined);
    displayTasks(filteredTasks, response.people, filteredCombined);
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
        var htmlString = '<li class="task" id="task-' + task.id +
            '" data-id="' + task.id + '"><p>' + task.name + '</p>' + selectText +
            '<button class="add-person-button">Add to Task</button>' +
            '<button class="status-button"></button>' +
            '<button class="delete-button">Delete</button><ul>';
        // Filter the array combining people and tasks to just the current task
        var filteredArray = combinedArray.filter(function(item) {
            return item.task_id === task.id;
        });
        console.log('Filtered array:', combinedArray);
        // Add all people who are linked to the current task
        filteredArray.forEach(function(person) {
            htmlString += '<li id="task-"' + task.id + '-person-' + person.person_id +
                '">' + person.person_name + '</li>';
        });
        htmlString += '</ul></li>';
        $('#taskOutputs').append(htmlString);
        if (task.complete) {
            $('#taskOutputs').find('#task-' + task.id).find('.status-button').text('Complete');
        } else {
            $('#taskOutputs').find('#task-' + task.id).find('.status-button').text('Incomplete');
        }
    });
}

function displayListSelect(listArray) {
    var htmlString = '';
    listArray.forEach(function(list) {
        htmlString += '<option value="' + list.id + '">' + list.name + '</option>';
    });
    $('#lists').html(htmlString);
}

function ajaxError(error) {
    console.log('AJAX error:', error);
}
