const express = require('express')
const app = express()

app.listen(8000, () => {
    console.log('server running on port 8000')
})

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

app.get('/getAllTodos', (req, res) => {
    return res.send(todos)
})

app.post('/createNewTodo/:todo', (req, res) => {
    const reqObj = JSON.parse(req.params.todo)
    let newId = (todos.length + 1)
    const newTodo = {id: newId, ...reqObj}
    todos.push(newTodo)
    return res.send(todos)
})