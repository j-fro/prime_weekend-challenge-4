$(document).ready(function() {
    // Add event handlers
    $('main').hide();
    $('#firstListItem').hide();
    getLists();
    getAllQueries();

    enable();
});

function enable() {
    // Set up event handlers
    $('#addTodoButton').on('click', addTask);
    $('#addPersonButton').on('click', addPerson);
    $('.add-list-button').on('click', addList);
    $('#deleteList').on('click', deleteList);
    $('#lists').on('change', getAllQueries);
    $(document).on('click', '.status-button', completeTask);
    $(document).on('click', '.delete-button', deleteTask);
    $(document).on('click', '.add-person-button', addPersonToTask);
    $(document).on('click', '.expand-button', expandTasks);
    $(document).on('click', '.collapse-button', collapseTasks);
}

function getAllQueries() {
    // Get all tasks, people, and lists
    $.ajax({
        url: '/combined',
        type: 'GET',
        success: function(response) {
            displayFiltered(response);
            $('.assignees').hide();
        },
        error: ajaxError
    });
}

function getLists() {
    $.ajax({
        url: '/list',
        type: 'GET',
        success: function(response) {
            checkForFirstList(response);
            displayListSelect(response);
        },
        error: ajaxError
    });
}

function checkForFirstList(listArray) {
    console.log('checking for first list:', listArray);
    if (listArray.length < 1) {
        $('#firstListItem').show();
        $('main').hide();
    } else {
        console.log('elsing');
        $('#firstListItem').hide();
        $('main').show();
    }
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
            name: $('.list-name-in').val()
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
    console.log('class:', $(this).parent().hasClass('completed-task'));
    // Flip the current status
    var status = !($(this).parent().hasClass('completed-task'));
    // $(this).toggleClass('completed-task');
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

function deleteList() {
    $.ajax({
        url: '/list',
        type: 'DELETE',
        data: {
            id: $('#lists').val()
        },
        success: function(response) {
            getLists();
        },
        error: ajaxError
    });
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

function expandTasks() {
    $(this).parent().find('.assignees').show();
    $(this).html('<i class="fa fa-caret-up fa-lg"></i>');
    $(this).removeClass('expand-button');
    $(this).addClass('collapse-button');
}

function collapseTasks() {
    $(this).parent().find('.assignees').hide();
    $(this).html('<i class="fa fa-caret-down fa-lg"></i>');
    $(this).removeClass('collapse-button');
    $(this).addClass('expand-button');
}

function displayFiltered(response) {
    console.log('displaying filtered');
    // displayListSelect(response.lists);
    var listId = $('#lists').val();
    console.log('list id:', listId);
    var filteredTasks = response.tasks.filter(function(task) {
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
        var htmlString = '<div class="task" id="task-' + task.id +
            '" data-id="' + task.id + '"><button class="status-button"></button>' +
            '<button class="expand-button"><i class="fa fa-caret-down fa-lg"></i></button>' + task.name;
        htmlString += selectText + '<button class="add-person-button"><i class="fa fa-plus fa-lg"></i></button>' +
            '<button class="delete-button"><i class="fa fa-times fa-lg"></i></button><div class="assignees">';
        // Filter the array combining people and tasks to just the current task
        var filteredArray = combinedArray.filter(function(item) {
            return item.task_id === task.id;
        });


        console.log('Filtered array:', combinedArray);
        // Add all people who are linked to the current task
        filteredArray.forEach(function(person) {
            htmlString += '<p id="task-"' + task.id + '-person-' + person.person_id +
                '">' + person.person_name + '</p>';
        });
        htmlString += '</div></div>';
        $('#taskOutputs').append(htmlString);
        if (task.complete) {
            $('#taskOutputs').find('#task-' + task.id).find('.status-button').html('<i class="fa fa-check-square-o fa-lg"></i>');
            $('#taskOutputs').find('#task-' + task.id).addClass('completed-task');
        } else {
            $('#taskOutputs').find('#task-' + task.id).find('.status-button').html('<i class="fa fa-square-o fa-lg"></i>');
            $('#taskOutputs').find('#task-' + task.id).removeClass('completed-task');
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
