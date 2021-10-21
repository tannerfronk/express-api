(function (window){

  let todoIdToBeEdited = -1;
  const taskNameInput = document.querySelector('#newTaskName')
  const addTaskBtn = document.querySelector('#addTaskButton')
  const selectedCategory = document.querySelector('#addSelectCategory')
  const saveTaskBtn = document.querySelector('#saveTaskButton')
  const errorDisplay = document.querySelector('#error')
  const deleteCompletedBtn = document.querySelector('#deleteCompleted')

  // generate html for each todo
  const updateTodos = (list) => {
    let taskList = document.querySelector('#taskList')
    taskList.innerHTML = `<ul>`
  
    list.map((list) => {
      taskList.innerHTML +=
        `<li class="card">
                  <div class="card-body">
                      <div>
                      <button type="button" id="task${list.id}Close" class="btn-close float-end ms-2 mt-1" aria-label="Close" todoID="${list.id}" buttonFunc="close"></button>
                          <button type="button" id="task${list.id}Edit" class="btn btn-success btn-sm float-end" todoID="${list.id}" buttonFunc="edit" taskName="${list.taskName}" categoryName="${list.category}">Edit</button>
                      </div>
                      <input type="checkbox" id="task${list.id}Completed" name="task${list.id}" ${list.completed == true ? 'checked' : ''} todoId="${list.id}" buttonFunc="complete">
                      <label for="task${list.id}"> ${list.taskName}</label><br>
                      <label for="task${list.id}"> ${list.category}</label><br>
                  </div>
              </li>`;
    })
    taskList.innerHTML += `</ul>`;
  
    taskList.addEventListener('click', eventClickHandler)
  }
  
  // get initial todos
  let todos = fetch('/getAllTodos')
  .then(res => res.json())
  .then(data => {
    updateTodos(data)
  })

  // add todo
  const handleAddTask = () => {
    let newTodo = taskNameInput.value
    let newCategory = selectedCategory.value

    if(newCategory === 'Select Category'){
      newCategory = 'Uncategorized'
    }

    let todoObj = JSON.stringify({
      taskName: newTodo,
      category: newCategory
    })

    try {
      fetch('/createNewTodo/', {
        method: 'POST',
        body: todoObj,
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
          }
      })
      .then(res => res.json())
      .then(data => {
        taskNameInput.value = ''
        selectedCategory.selectedIndex = 0
        updateTodos(data)
      })
    } catch(e){
      console.log(e)
      errorDisplay.innerHTML = 'There was an error creating a task, please try again later.'
      errorDisplay.style.color = 'red'
    }
  }
  
  addTaskBtn.addEventListener('click', handleAddTask)
  taskNameInput.addEventListener('keydown', (e) => {
    if(e.code === 'Enter'){ // allows enter to process new task
      handleAddTask()
    }
  })

  const handleEditTask = () => {
    let updatedName = taskNameInput.value
    let updatedCategory = selectedCategory.value
    let updatedTodoID = todoIdToBeEdited
    
    if(updatedCategory === 'Select Category'){
      updatedCategory = 'Uncategorized'
    }

    let todoObj = JSON.stringify({
      id: updatedTodoID,
      taskName: updatedName,
      category: updatedCategory
    })
    try {
      fetch('/updateTodo/', {
        method: 'PUT',
        body: todoObj,
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
          }
      })
      .then(res => res.json())
      .then(data => {
        document.querySelector('#newTaskName').value = '';
        document.querySelector('#saveTaskButton').style.display = 'none';
        document.querySelector('#addTaskButton').style.display = 'block';
        updateTodos(data)
      })
    } catch(e){
      console.log(e)
      errorDisplay.innerHTML = 'There was an error updating the task, please try again later.'
      errorDisplay.style.color = 'red'
    }
  }
  
  saveTaskBtn.addEventListener('click', handleEditTask)
  
  const handleDeleteTask = (id, deleteAll = false) => {
    let taskID = id
    let todoObj = {}
    if(deleteAll){
      todoObj = JSON.stringify({
        deleteAll: true
      })
    } else{
      todoObj = JSON.stringify({
        id: taskID,
        deleteAll: false
      })
    }

    try{
      fetch('/deleteTodo/', {
        method: 'DELETE',
        body: todoObj,
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
          }
      })
      .then(res => res.json())
      .then(data => {
        updateTodos(data)
      })
    } catch(e){
      console.log(e)
      errorDisplay.innerHTML = 'There was an error deleting the task, please try again later.'
      errorDisplay.style.color = 'red'
    }
  }

  deleteCompletedBtn.addEventListener('click', eventClickHandler)

  // event handlers
  function eventClickHandler(event) {
    if (event.target.attributes.buttonFunc.value == 'complete') {
      todoIdToBeEdited = parseInt(event.target.attributes.todoId.value)
      handleEditTask()
    } else if (event.target.attributes.buttonFunc.value == 'close') {
        handleDeleteTask(event.target.attributes.todoId.value)
    } else if (event.target.attributes.buttonFunc.value == 'edit') {
        editTodo(event.target.attributes)
        todoIdToBeEdited = parseInt(event.target.attributes.todoId.value)
    } else if (event.target.attributes.buttonFunc.value == 'deleteAll'){
        handleDeleteTask(null, true)
    }
  }

})(window)


/******************* EVERYTHING BELOW IS CODE I DID NOT SOLELY WRITE AND EXISTS FOR LIMITED FUNCTIONALITY WHICH WILL BE REPLACED LATER *******************/

let categories = []

// event listener for add category btn
document.querySelector("#addCategoryButton").addEventListener('click', () => {
  let createCategoryButton = document.querySelector("#addCategoryButton")
  let inputBox = document.querySelector('#newCategoryName')
  let selectedCategory = document.querySelector('#filterCategory')

  let newCategory = inputBox.value

  if (createCategoryButton.innerText === "Save") {

    let dropdownOptions = document.querySelectorAll('.filterOption')

    for (dropdown of dropdownOptions) {
      if (dropdown.value === selectedCategory.value) {
        dropdown.value = newCategory
        dropdown.innerText = newCategory
      }
    }


    document.querySelector('#addCategoryButton').innerText = 'Create Category';

  } else if (!categories.includes(newCategory) && newCategory != "") {

    categories.push(newCategory)

    let dropdowns = document.querySelectorAll('.categoryPicker')
    dropdowns.forEach((dropdown) => {
      const newElement = document.createElement('option');
      newElement.className = "filterOption"
      newElement.value = newCategory
      newElement.innerHTML = newCategory
      dropdown.appendChild(newElement)
    })
  }

  selectedCategory.selectedIndex = 0;
  inputBox.value = "";
})

document.querySelector("#editCategoryButton").addEventListener('click', (event) => {
  let selectedItem = document.querySelector("#filterCategory").value;

  if (selectedItem !== "Filter By Category" && selectedItem !== "Uncategorized") {
    editCategory(selectedItem)
  }
})

function editCategory(categoryName) {
  document.querySelector('#newCategoryName').value = categoryName;
  document.querySelector('#addCategoryButton').innerText = 'Save';
}

//edit 
function editTodo(task) {
  // todoIdToBeEdited = parseInt(task.todoId.value);
  document.querySelector('#newTaskName').value = task.taskName.value;
  document.querySelector('#addSelectCategory').value = task.categoryName.value;
  document.querySelector('#saveTaskButton').style.display = 'block';
  document.querySelector('#addTaskButton').style.display = 'none';
}
