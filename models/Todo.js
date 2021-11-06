const {model, Schema} = require('mongoose')

const Todo = new Schema({
    id: Number,
    taskName: String,
    completed: {
        type: Boolean,
        default: false,
    },
    category: String
})

module.exports = model("todo", Todo)