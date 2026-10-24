const messages = require('./data');
const express = require('express');
//const cors = require('cors')

const server = express();
server.use(express.json());

//USE CORS
//server.use(cors());

//SETUP SERVER
const PORT = 3000;

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

//GET ALL MESSAGES
server.get('/messages', (req, res) => {
    res.json(messages);
});

//CREATE MESSAGE
server.post('/messages', (req, res) => {
    const newMessage = {
        id: messages.length > 0
            ? Math.max(...messages.map(message => message.id)) + 1
            : 1,
        user: req.body.user,
        text: req.body.text,
        timestamp: new Date().toISOString()
    };


    messages.push(newMessage);    
    res.status(201).json(messages);
});

//GET ONE MESSAGE
server.get('/messages/:id', (req, res) => {
    const id = Number(req.params.id)
    const message = messages.find(message => message.id === id)

    if (!message) {
        return res.status(404).json({message: "Message not found"})
    }
    res.json(message);
});

//UPDATE MESSAGE
server.put('/messages/:id', (req, res) => {
    const id = Number(req.params.id)
    const message = messages.find(message => message.id === id)

    if (!message) {
        return res.status(404).json({message: "Message not found"})
    }

    message.text = req.body.text
    res.json(message)

    
});