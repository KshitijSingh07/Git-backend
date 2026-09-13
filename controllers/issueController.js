import Repository from "../models/repoModel.js";
import User from "../models/userModel.js";
import Issue from "../models/issueModel.js";

const createIssue = async (req, res) => {
    const { title, description } = req.body;
    const { id } = req.params;
    try {
        const issue = new Issue({
            title,
            description,
            repository: id,
        });
        await issue.save();
        res.status(201).json(issue);
    } catch (error) {
        console.log("Error in creating issue: ", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};


const updateIssueById = async (req, res) => {
    const {id} = req.params;
    const {title,description, status} = req.body;
    try {
        const issue = await Issue.findById(id);
        if(!issue){
            return res.status(404).json({error:"Issue not found"});
        }
        issue.title = title;
        issue.description = description;
        issue.status= status;
        await issue.save();
        res.json(issue , {message:"Issue Updated."});
    } catch (error) {
        console.log("Error in updating issue: ", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

const deleteIssueById = async (req, res) => {
    const {id} = req.params;
    try{
       const issue =  await Issue.findByIdAndDelete(id);
          if(!issue){
            return res.status(404).json({error:"Issue not found"});
        }
         res.json({message:"Issue deleted"});
    }catch (error) {
        console.log("Error in updating issue: ", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};



const getAllIssues = async (req, res) => {
    const {id} = req.params;
      try{
       const issues =  await Issue.find({_id:id});
          if(!issues){
            return res.status(404).json({error:"Issue not found"});
        }
         res.status(200).json(issues);
    }catch (error) {
        console.log("Error in getting issue: ", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }

};

const getIssueById = async (req, res) => {
    const {id} = req.params;
    try{
       const issue =  await Issue.findById(id);
          if(!issue){
            return res.status(404).json({error:"Issue not found"});
        }
         res.status(200).json(issue);
    }catch (error) {
        console.log("Error in updating issue: ", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};


const issueController = { createIssue, updateIssueById, deleteIssueById, getAllIssues, getIssueById };

export default issueController;