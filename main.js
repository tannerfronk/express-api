const express = require('express')
const app = express()

app.listen(8000, () => {
    console.log('server running on port 8000')
})

// default todos
let todos = [
    {
        id: 1,
        taskName: "Organize Files",
        completed: false,
        category: 1
    },
    {
        id: 2,
        taskName: "Complete History Homework",
        completed: true,
        category: 2
    },
    {
        id: 3,
        taskName: "Take out the trash",
        completed: false,
        category: 4
    },
    {
        id: 4,
        taskName: "Restring Guitar",
        completed: false,
        category: 3
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
app.post('/createNewTodo/:todo', (req, res) => {
    const reqObj = JSON.parse(req.params.todo)
    let newID = (todos.length + 1)
    const newTodo = {id: newID, ...reqObj}
    todos.push(newTodo)
    return res.send(todos)
})

// update a todo
app.put('/updateTodo/:updatedTodo', (req, res) => {
    const updatedTodo = JSON.parse(req.params.updatedTodo)
    todos = todos.map(todo => {
        if(todo.id === updatedTodo.id){
            return updatedTodo
        }
        return todo
    })
    return res.send(todos)
})

// delete a todo
app.delete('/deleteTodo/:id', (req, res) => {
    const todoId = parseInt(req.params.id)
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
    let newCatID = (categories.length + 1)
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