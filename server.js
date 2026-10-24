const todos = require('./data');
const express = require('express');

const server = express();
server.use(express.json());

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
    const newTodo = req.body;

    todos.push(newTodo);
    res.status(201).json(newTodo);
});