// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks"));
let nextId = JSON.parse(localStorage.getItem("nextId"));

// Todo: create a function to generate a unique task id
function generateTaskId() {
  if (!nextId) nextId = 1;
  return nextId++;
}

// Todo: create a function to create a task card
function createTaskCard(task) {
  return `
    <div class="card mb-2" data-id="${task.id}">
      <div class="card-body">
        <h5 class="card-title">${task.title}</h5>
        <p class="card-text">Due: ${task.dueDate}</p>
      </div>
    </div>`;
}

// Todo: create a function to render the task list and make cards draggable
function renderTaskList() {
  $("#todo-cards, #in-progress-cards, #done-cards").empty();

  taskList.forEach((task) => {
    let taskHtml = createTaskCard(task);
    if (task.status === "todo") {
      $("#todo-cards").append(taskHtml);
    } else if (task.status === "in-progress") {
      $("#in-progress-cards").append(taskHtml);
    } else if (task.status === "done") {
      $("#done-cards").append(taskHtml);
    }
  });

  $(".card").draggable({
    revert: "invalid",
    containment: ".swim-lanes",
    helper: "clone",
    start: function (event, ui) {
      $(this).hide();
    },
    stop: function (event, ui) {
      $(this).show();
    },
  });
}

// Todo: create a function to handle adding a new task
function handleAddTask(event) {
  event.preventDefault();

  let title = $("#task-title").val();
  let dueDate = $("#due-date").val();
  let task = {
    id: generateTaskId(),
    title,
    dueDate,
    status: "todo",
  };

  taskList.push(task);
  localStorage.setItem("tasks", JSON.stringify(taskList));
  localStorage.setItem("nextId", nextId);

  renderTaskList();

  $("#formModal").modal("hide");
  $("#task-form")[0].reset();
}

// Todo: create a function to handle deleting a task
function handleDeleteTask(event) {}

// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {
  let taskId = ui.helper.data("id");
  let newStatus = $(this).attr("id").replace("-cards", "");

  taskList = taskList.map((task) => {
    if (task.id == taskId) {
      task.status = newStatus;
    }
    return task;
  });

  localStorage.setItem("tasks", JSON.stringify(taskList));

  renderTaskList();
}

$(".card-body").droppable({
  accept: ".card",
  drop: handleDrop,
});

// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {
  taskList = taskList || [];
  nextId = nextId || 1;

  renderTaskList();

  $("#task-form").on("submit", handleAddTask);

  $("#due-date").datepicker();

  $(".card-body").droppable({
    accept: ".card",
    drop: handleDrop,
  });
});
