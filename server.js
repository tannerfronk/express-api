const express = require('express')
const bodyParser = require('body-parser');
const app = express()

app.listen(8000, () => {
    console.log('server running on port 8000')
})

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.text());

app.use(express.static('static'))

// default todos
let todos = [
    {
        id: 1,
        taskName: "Organize Files",
        completed: false,
        category: 'Work'
    },
    {
        id: 2,
        taskName: "Complete History Homework",
        completed: true,
        category: 'School'
    },
    {
        id: 3,
        taskName: "Take out the trash",
        completed: false,
        category: 'Home'
    },
    {
        id: 4,
        taskName: "Restring Guitar",
        completed: false,
        category: 'Uncategorized'
    },
]

// default categories
let categories = [
    {
        id: 1,
        name: 'Work'
    },
    {
        id: 2,
        name: 'School'
    },
    {
        id: 3,
        name: 'Uncategorized'
    },
    {
        id: 4,
        name: 'Home'
    },
]

// get all todos
app.get('/getAllTodos', (req, res) => {
    return res.send(todos)
})

// create new todo
app.post('/createNewTodo/', (req, res) => {
    let newID = todos.length + 1
    const newTodo = {
        id: newID,
        taskName: req.body.taskName,
        completed: false,
        category: req.body.category
    }
    todos.push(newTodo)
    return res.send(todos)
})

// update a todo
app.put('/updateTodo/', (req, res) => {
    
    const taskID = req.body.id
    const updatedName = req.body.taskName
    const updatedCategory = req.body.category

    if(updatedName !== '' && updatedCategory !== ''){
        todos = todos.map(todo => {
            if(todo.id === taskID){
                todo.taskName = updatedName
                todo.category = updatedCategory
            }
            return todo
        })
    } else {
        todos = todos.map(todo => {
            if(todo.id === taskID){
                todo.completed = !todo.completed
            }
            return todo
        })
    }

    return res.send(todos)
})

// delete a todo
app.delete('/deleteTodo/', (req, res) => {
    const todoId = parseInt(req.body.id)
    todos = todos.filter((todo) => {
        if(todo.id !== todoId){
            return todo
        }
    })
    return res.send(todos)
})

// get categories
app.get('/getCategories', (req, res) => {
    return res.send(categories)
})

// add category
app.post('/newCategory/:category', (req, res) => {
    let newCategory = req.params.category
    let newCatID = categories.length + 1
    const isExisting = categories.some(category => category.name.toLowerCase() === newCategory.toLowerCase())
    if(isExisting === true){
        res.status(400)
        return res.send('This category already exists')
    }
    categories.push({id: newCatID, name: newCategory})
    return res.send(categories)
})

// update category
app.put('/updateCategory/:category', (req, res) => {
    let updatedCategory = JSON.parse(req.params.category)
    categories = categories.map((category) => {
        if(category.id === updatedCategory.id) {
            return updatedCategory
        }
        return category
    })
    return res.send(categories)
})

// delete category
app.delete('/deleteCategory/:id', (req, res) => {
    let categoryID = parseInt(req.params.id)
    categories = categories.filter((category) => {
        if(category.id !== categoryID){
            return category
        }
    })
    return res.send(categories)
})