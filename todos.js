const todos = require('./data');
const express = require('express');
const cors = require('cors')

const server = express();
server.use(express.json());

server.use(cors());

server.get('/', (req, res) => {
  res.send('Hello Express.js 🎉');
});

const PORT = 3000;

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

server.get('/todos', (req, res) => {
    res.json(todos);
});

server.post('/todos', (req, res) => {
    const newTodo = {
        id: todos.length > 0
            ? Math.max(...todos.map(todo => todo.id)) + 1
            : 1,
        task: req.body.task,
        completed: false
    };


    todos.push(newTodo);    
    res.status(201).json(todos);
});

server.get('/todos/:id', (req, res) => {
    const id = Number(req.params.id)
    const todo = todos.find(todo => todo.id === id)

    if (!todo) {
        return res.status(404).json({message: "Todo not found"})
    }
    res.json(todo);
});

server.put('/todos/:id', (req, res) => {
    const id = Number(req.params.id)
    const todo = todos.find(todo => todo.id === id)

    if (!todo) {
        return res.status(404).json({message: "Todo not found"})
    }

    todo.task = req.body.task
    todo.completed = req.body.completed
    res.json(todo)

    
});