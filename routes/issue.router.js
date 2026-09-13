import express from "express";
import issueController from "../controllers/issueController.js";
const issueRouter = express.Router(); 

issueRouter.post("/issue/create", issueController.createIssue);
issueRouter.put("/issue/update/:id", issueController.updateIssueById);
issueRouter.delete("/issue/delete/:id", issueController.deleteIssueById);
issueRouter.get("/issue/all", issueController.getAllIssues);
issueRouter.get("/issue/:id", issueController.getIssueById);


export default issueRouter;
