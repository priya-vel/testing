
const express = require("express");
const app = express();
const utils = require('./utils/task-schema.js');

app.use(express.json());

const tasks =[
    {
        id: 1,
        name:"Task 1",
        completed: false
    },
    {
        id: 2,
        name:"Task 2",
        completed: false
    },
    {
        id: 3,
        name:"Task 3",
        completed: false
    },
];
//get
app.get("/api/tasks", (req,res)=>{
    res.send(tasks);
});
// get(by id)

app.get("/api/tasks/:id", (req,res)=>{
    const taskId = req.params.id;
    const task = tasks.find(task => task.id === parseInt(taskId));
    if(!task) return response.status(404).send("The task with the provided id does not exist.");
    res.send(task);
});
//post
app.post("/api/tasks", (request, response) => {
    const { error } = utils.validateTask(request.body);

    if(error) return response.status(400).send("The name should be at least 3 chars long!")

    const task = {
        id: tasks.length + 1,
        name: request.body.name,
        completed: request.body.completed
    };

    tasks.push(task);
    response.status(201).send(task);
});
//put
app.put("/api/tasks/:id", (request, response) => {
    const taskId = request.params.id;
    const task = tasks.find(task => task.id === parseInt(taskId));
    if(!task) return response.status(404).send("The task with the provided ID does not exist.");

    const { error } = utils.validateTask(request.body);

    if(error) return response.status(400).send("The name should be at least 3 chars long!")

    task.name = request.body.name;
    task.completed = request.body.completed;

    response.send(task);
});
//PATCH
app.patch("/api/tasks/:id", (request, response) => {
    const taskId = request.params.id;
    const task = tasks.find(task => task.id === parseInt(taskId));
    if(!task) return response.status(404).send("The task with the provided ID does not exist.");

    const { error } = utils.validateTask(request.body);

    if(error) return response.status(400).send("The name should be at least 3 chars long!")

    task.name = request.body.name;

    if(request.body.completed) {
        task.completed = request.body.completed;
    }
    response.send(task);
});
//delete
app.delete("/api/tasks/:id", (req,res)=>{
    const taskId = req.params.id;
    const task = tasks.find(task => task.id === parseInt(taskId))
    if(!task) return res.status(404).send("The task with the provided ID does not exist");


    const index = tasks.indexOf(task);
    tasks.splice(index,1);
    res.send(task);
})

const port = process.env.PORT || 3000;


module.exports = app.listen(port, ()=> console.log(`Listening on port ${port}...`));