import express from 'express';
import messages from './data.js';
import db from "./database.js"
import cors from "cors"
import { httpServerHandler } from "cloudflare:node";

const server = express();
server.use(express.json());


server.use(cors());

//SETUP SERVER
const PORT = 3000;

//server.use(express.static("public"));
/*server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});*/

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

//***********************USERS********************************************************************
// Get all users
server.get("/users", async (req, res) => {
    try {
        const [users] = await db.query("SELECT * FROM users");
        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch users" });
    }
});

// Get one user
server.get("/users/:id", async (req, res) => {
    try {
        const id = req.params.id
        const [users] = await db.query("SELECT * FROM users WHERE id = ?",
        [id]);

        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch users" });
    }
});

//Create user
server.post("/users", async (req, res) => {
    try {
        const { username, name } = req.body;

        const [result] = await db.query(
            "INSERT INTO users (username, name) VALUES (?, ?)",
            [username, name]
        );

        res.status(201).json({
            id: result.insertId,
            username,
            name
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to create user" });
    }
});

//UPDATE USER
server.put("/users/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const { username, name } = req.body;

        const [result] = await db.query(
            "UPDATE users SET username = ?, name = ? WHERE id = ?",
            [username, name, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "User not found" });
        }

        res.json({
            id: Number(id),
            username,
            name
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to update user" });
    }
});

//DELETE USER
server.delete("/users/:id", async (req, res) => {
    try {
        const id = req.params.id;
        
        const [result] = await db.query(
            "DELETE from users WHERE id = ?",
            [id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "User not found" });
        }

        res.json("User deleted");
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to delete user" });
    }
});

server.listen(3000);

export default httpServerHandler({ port: 3000 });