import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { Server } from "socket.io";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import http from "http";
import yargs from "yargs";
import {hideBin} from "yargs/helpers";
import initRepo from "./controllers/init.js";
import addRepo from "./controllers/add.js";
import commitRepo from "./controllers/commit.js";
import pullRepo from "./controllers/pull.js";
import pushRepo from "./controllers/push.js";
import revertRepo from "./controllers/revert.js";
import mainRouter from "./routes/main.router.js";


dotenv.config();

yargs(hideBin(process.argv))
.command("start","start new server",{},startServer)
.command("init","Initialize a new repository",{},initRepo)
.command("add <file>","Add a file to repository",
    (yargs)=>{yargs.positional("file" , {
        describe: "File to add to the stagging area",
        type: "string"
    })}, (argv)=>{ addRepo(argv.file)})
.command("commit <message>","Commit the staged files",
    (yargs)=>{yargs.positional("message" , {
        describe: "Commit message",
        type: "string"
    })}, (argv)=>{ commitRepo(argv.message)})
.command("push","Push commit to S3",{}, pushRepo)
.command("pull","pull commit from S3",{}, pullRepo)

.command("revert <commitID>","Revert to a specific commit",
    (yargs)=>{yargs.positional("commitID" , {
        describe: "Commit ID to revert to",
        type: "string"
    })}, (argv)=>{revertRepo(argv.commitID)})
.demandCommand(1,"you need atleast one command")
.help().argv;



function startServer(){
    const app = express();
    const port = process.env.PORT || 3000;

    app.use(bodyParser.json());
    app.use(express.json());
    const mongoURI = process.env.MONGO_URI;

    mongoose.connect(mongoURI)
    .then(()=>{
        console.log("Mongodb connected.")
    })
    .catch((e)=>{
        console.log("Unable to connect DB ", e);
    });

    app.use(cors({origin: "*"}));
    app.use("/", mainRouter);
 
   

    let user = "test";
    const httpServer = http.createServer(app);
    const io = new Server(httpServer, {cors:{origin:"*", methods: ["GET", "POST"]}})

    io.on("connection", (socket)=>{
        socket.on("joinRoom", (userID)=>{
            user = userID;
            console.log("======")
            console.log(user);
            console.log("======")
            socket.join(userID);
        });
    });

    const db = mongoose.connection;
    db.once("open", async ()=>{
        console.log("CRUD operations called.");
        // crud operations
    });

    httpServer.listen(port, ()=>{
        console.log(`Server is running on Port ${port}`);
    });
}