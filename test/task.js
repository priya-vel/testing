let chai = require("chai");
let chaiHttp = require("chai-http");
const { response } = require("express");
let server = require("../index");

//assertion style

chai.should();
chai.use(chaiHttp);
describe('Task API', ()=>{
/**server
 * Test the get route
 */
describe("GET/api/tasks",()=>{
    it("It should get all the tasks",(done)=>{
        chai.request(server)
        .get('/api/tasks')
        .end((err,response)=>{
            response.should.have.status(200);
            response.body.should.be.a('array');
            response.body.should.be.eq(3);
            done();
        });
    });
    it("It should not get all the tasks",(done)=>{
        chai.request(server)
        .get('/api/tasks')
        .end((err,response)=>{
            response.should.have.status(400);
            
            done();
        });
    });
    
});
/**
 * test the get all (byid) route
 */

describe('GET/api/tasks:id',()=>{
    it("It should get all the elements by id",(done)=>{
        const taskId = 1;
        chai.request(server)
             .get("/api/task/"+taskId)
             .end((err,response)=>{
                 response.should.have.status(200);
                 response.body.should.be.a('object');
                 response.body.should.have.property('id');
                 response.body.should.have.property('name');
                 response.body.should.have.property('name');
                 response.body.should.have.property('id').eq(1);
                 done();
             });
    });
    it("It should not get all the elements by id",(done)=>{
        const taskId = 123;
        chai.request(server)
             .get("/api/task/"+taskId)
             .end((err,response)=>{
                 response.should.have.status(400);
                 
                 response.text.should.be.eq("The task with the provided id doesnot exists");
                 done();
             });
    });
})

/**
 * Test the post route
 * 
 */

describe("POST/api/tasks",()=>{
    it("It should POST a new task",(done)=>{
        const task={
            name: "Task 4",
            completed: false
        };
        chai.request(server)
            .post("/api/tasks")
            .send(task)
            .end((err,response)=>{
                response.should.have.status(200);
                response.body.should.be.a('object');
                response.body.should.have.property('id').eq(4);
                response.body.should.have.property('name').eq("Task 4");
                response.body.should.have.property('completed').eq(false)
                done();
            });
    });
    it("It should not POST a new task",(done)=>{
        const task={
            name: "Ta",
            completed: false
        };
        chai.request(server)
            .post("/api/tasks")
            .send(task)
            .end((err,response)=>{
                response.should.have.status(400);
                response.text.should.be.eq("The name should have atleast 3 chars!");
                done();
            });
    });

});

/**
 * test the put route
 */
    describe("PUT/api/task/:id",()=>{
        it("It should PUT an existing task",(done)=>{
            const taskId = 1;
            const task ={
                name:"task 1 changed",
                completed: true
            } ;
            chai.request(server)
                .put("/api/tasks/"+ taskId) 
                .send(task)
                .end((err,response)=>{
                    response.should.have.status(200);
                    response.body.should.a('object');
                    response.body.should.have.property('id').eq(1);
                    response.body.should.have.property('name').eq("task 1 changed");
                    response.body.should.have.property('completed').eq(true);
                    done();
                });
        });
        it("It should not PUT an existing task with a name lessthan 3 charactrs",(done)=>{
            const taskId = 1;
            const task ={
                name:"ta",
                completed: true
            } ;
            chai.request(server)
                .put("/api/tasks/"+ taskId) 
                .send(task)
                .end((err,response)=>{
                    response.should.have.status(400);
                    response.text.body.should.eq('The name should be at least 3 characters long');
                    
                    done();
                });
        });

    })
    /**
     * test the patch route 
     */
    
     describe("PATCH /api/tasks/:id", () => {
        it("It should PATCH an existing task", (done) => {
            const taskId = 1;
            const task = {
                name: "Task 1 patch"
            };
            chai.request(server)                
                .patch("/api/tasks/" + taskId)
                .send(task)
                .end((err, response) => {
                    response.should.have.status(200);
                    response.body.should.be.a('object');
                    response.body.should.have.property('id').eq(1);
                    response.body.should.have.property('name').eq("Task 1 patch");
                    response.body.should.have.property('completed').eq(true);
                done();
                });
        });

        it("It should NOT PATCH an existing task with a name with less than 3 characters", (done) => {
            const taskId = 1;
            const task = {
                name: "Ta"
            };
            chai.request(server)                
                .patch("/api/tasks/" + taskId)
                .send(task)
                .end((err, response) => {
                    response.should.have.status(400);
                    response.text.should.be.eq("The name should be at least 3 chars long!");
                done();
                });
        });        
    });
    /**
     * Test the DELETE route
     */
     describe("DELETE /api/tasks/:id", () => {
        it("It should DELETE an existing task", (done) => {
            const taskId = 1;
            chai.request(server)                
                .delete("/api/tasks/" + taskId)
                .end((err, response) => {
                    response.should.have.status(200);
                done();
                });
        });

        it("It should NOT DELETE a task that is not in the database", (done) => {
            const taskId = 145;
            chai.request(server)                
                .delete("/api/tasks/" + taskId)
                .end((err, response) => {
                    response.should.have.status(404);
                    response.text.should.be.eq("The task with the provided ID does not exist.");
                done();
                });
        });

    });
});
