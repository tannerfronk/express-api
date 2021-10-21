(function (window){

  const taskNameInput = document.querySelector('#newTaskName')
  const selectedCategory = document.querySelector('#addSelectCategory')

  // get initial todos
  let todos = fetch('/getAllTodos')
  .then(res => res.json())
  .then(data => {
    updateTodos(data)
  })

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

  // get task info and send to server
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
    console.log(todoObj)

    fetch('/createNewTodo/', {
      method: 'POST',
      body: todoObj,
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
        }
    })
    .then(res => res.json())
    .then(data => {
      updateTodos(data)
    })
  }

  // add todo
  let addTaskBtn = document.querySelector('#addTaskButton')
  addTaskBtn.addEventListener('click', handleAddTask)
  
  

  
  // complete todo
  function completeTodo(id) {
    todos = todos.filter(element => {
      if (element.id == id) {
        element.completed = !element.completed;
      }
      return element;
    })
  }

  // delete todo
  function deleteTodo(id) {
    todos = todos.filter(element => {
      if (element.id != id) {
        return element;
      }
  
    })
  
    updateTodos(todos)
  }

  // event handlers
  function eventClickHandler(event) {
    // console.log(event)
    // console.log(event.target.id)
    // console.log(event.target.attributes.buttonFunc.value)
    // console.log(event.target.attributes.todoId)
  
    if (event.target.attributes.buttonFunc.value == "complete") {
      completeTodo(event.target.attributes.todoId.value)
    } else if (event.target.attributes.buttonFunc.value == "close") {
      deleteTodo(event.target.attributes.todoId.value)
    } else if (event.target.attributes.buttonFunc.value == "edit") {
      editTodo(event.target.attributes)
    }
  }

})(window)





// let todos = [{
//     id: 1,
//     taskName: "Task 1",
//     completed: false,
//     category: "Work"
//   },
//   {
//     id: 2,
//     taskName: "Task 2",
//     completed: true,
//     category: "School"
//   },
//   {
//     id: 3,
//     taskName: "Task 3",
//     completed: false,
//     category: "Uncategorized"
//   },
// ]
let categories = []

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



// event listener for add task btn
// document.querySelector("#addTaskButton").addEventListener('click', () => {

//   let inputBox = document.querySelector('#newTaskName');
//   let newTaskName = inputBox.value
//   if (newTaskName !== '') {
//     let newId = Math.floor(Math.random() * 1000000);
//     let newCategory = document.querySelector('#addSelectCategory').value // new todo select will always be first
//     if (newCategory === 'Select Category') {
//       newCategory = 'Uncategorized'
//     }

//     inputBox.value = "";

//     todos.push({
//       id: newId,
//       taskName: newTaskName,
//       completed: false,
//       category: newCategory
//     })
//     updateTodos(todos);
//     console.log(todos)
//   }
// })

// event listener for add category btn
document.querySelector("#addCategoryButton").addEventListener('click', () => {
  let createCategoryButton = document.querySelector("#addCategoryButton")
  let inputBox = document.querySelector('#newCategoryName')
  let selectedCategory = document.querySelector('#filterCategory')

  let newCategory = inputBox.value

  if (createCategoryButton.innerText === "Save") {

    let dropdownOptions = document.querySelectorAll('.filterOption')

    todos.forEach((todo) => {
      if (todo.category === selectedCategory.value) {
        todo.category = newCategory;
      }
    })

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

  updateTodos(todos);
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


function deleteCompleted() {
  todos = todos.filter(element => {
    if (element.completed === false) {
      return element
    }
  })
  updateTodos(todos)
}


let todoIdToBeEdited = -1;
//edit 
function editTodo(task) {
  todoIdToBeEdited = parseInt(task.todoId.value);
  document.querySelector('#newTaskName').value = task.taskName.value;
  document.querySelector('#addSelectCategory').value = task.categoryName.value;
  document.querySelector('#saveTaskButton').style.display = 'block';
  document.querySelector('#addTaskButton').style.display = 'none';
}

//save 
const saveTodo = () => {
  let newTaskName = document.querySelector('#newTaskName').value;
  let selectedCategory = document.querySelector('#addSelectCategory');

  if (selectedCategory.selectedIndex == 0) {
    selectedCategory.value = "Uncategorized";
  }

  todos.forEach(element => {
    if (element.id === todoIdToBeEdited) {
      element.category = selectedCategory.value;
      element.taskName = newTaskName;
    }

  });

  document.querySelector('#newTaskName').value = '';
  document.querySelector('#saveTaskButton').style.display = 'none';
  document.querySelector('#addTaskButton').style.display = 'block';
  selectedCategory.selectedIndex = 0;
  todoIdToBeEdited = -1;
  updateTodos(todos);
}

document.querySelector('#saveTaskButton').addEventListener('click', () => {
  saveTodo();
})

// grab unique categories and display them in drop down
function getAllCategories() {

  categories = todos.map((todo) => {
    if (!categories.includes(todo.category) && todo.category != '') {

      let dropdowns = document.querySelectorAll(".categoryPicker");
      dropdowns.forEach((dropdown) => {
        const newElement = document.createElement('option');
        newElement.className = "filterOption"
        newElement.value = `${todo.category}`
        newElement.innerHTML = `${todo.category}`
        dropdown.appendChild(newElement)
      })
      return todo.category
    }
  })
}

//view by Categories
const filterList = (event) => {
  let selectElement = event.target;
  let value = selectElement.value;
  let filteredList = todos.filter(e => e.category == value);
  filteredList.length > 0 ? updateTodos(filteredList) : updateTodos([]);

}
const categoryDropDown = document.getElementById('filterCategory');
categoryDropDown.addEventListener('change', filterList);

// getAllCategories();
// updateTodos(todos);
