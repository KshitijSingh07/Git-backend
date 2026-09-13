import mongoose from "mongoose";
import Repository from "../models/repoModel.js";
import User from "../models/userModel.js"
import Issue from "../models/issueModel.js"

const createRepository = async (req, res) => {
    const { owner, name, issues, content, description, visibility } = req.body;

    try {
        if (!name) {
            return res.status(400).json({ error: "Repository name is required." })
        }
        if (!mongoose.Types.ObjectId.isValid(owner)) {
            return res.status(400).json({ error: "invalid user is." })
        }
        const newRepository = new Repository({
            name, description, visibility, owner, content, issues
        });
        const result = await newRepository.save();
        res.status(201).json({ message: "Repository created", repositoryId: result._id })

    } catch (error) {
        console.error("Error during repo creation :", error.message);
        res.status(500).json({ message: "Server error" });
    }
};

const getAllRepositories = async (req, res) => {
    try {

        const repositories = await Repository.find({}).populate("owner").populate("issues");
        res.json(repositories);
    } catch (error) {
        console.error("Error during repo creation :", error.message);
        res.status(500).json({ message: "Server error" });
    }
};


const fetchRepositoryById = async (req, res) => {
    const { id } = req.params;
    try {
        const repository = await Repository.findOne({ _id: id }).populate("owner").populate("issues");
        res.json(repository);
    } catch (error) {
        console.error("Error during repo creation :", error.message);
        res.status(500).json({ message: "Server error" });
    }
};

const fetchRepositoryByName = async (req, res) => {
    const { name } = req.params;
    try {
        const repository = await Repository.findOne({ name: name }).populate("owner").populate("issues");
        res.json(repository);
    } catch (error) {
        console.error("Error during repo creation :", error.message);
        res.status(500).json({ message: "Server error" });
    }
};


const fetchRepositoryForCurrentUser = async (req, res) => {
    const userId = req.user;

    try {
        const repositories = await Repository.find({ owner: userId });
        if (!repositories) {
            return res.status(404).json({ error: "User repositories not found." });
        }

        res.json({ message: "Repositories found", repositories });
    } catch (error) {
        console.error("Error during repo creation :", error.message);
        res.status(500).json({ message: "Server error" });
    }
};

const updateRepositoryById = async (req, res) => {
    const { id } = req.params;
    const { content, description } = req.body;
    try {
        const repository = await Repository.findById(id);
        if (!repository) {
            return res.status(404).json({ error: "User repositories not found." });
        }
        repository.content.push(content);
        repository.description = description;
        const updatedRepository = await repository.save();
        res.json({
            message:"Repository updated ",
            repository: updatedRepository,
        });
         
    } catch (error) {
        console.error("Error during repo creation :", error.message);
        res.status(500).json({ message: "Server error" });
    }
};


const deleteRepositoryById = async (req, res) => {
    const {id} = req.params;
    try {
        const repository = await Repository.findOneAndDelete(id);
        if (!repository) {
            return res.status(404).json({ error: "User repositories not found." });
        }
        res.json({message:"Repository Deleted"})
    } catch (error) {
        console.error("Error during repo creation :", error.message);
        res.status(500).json({ message: "Server error" });
    }
};


const toggleVisibilityById = async (req, res) => {
   const { id } = req.params;
    try {
        const repository = await Repository.findById(id);

        if (!repository) {
            return res.status(404).json({ error: "User repositories not found." });
        }
        repository.visibility = !repository.visibility;
        
        const updatedRepository = await repository.save();
        res.json({
            message:"Visibility updated ",
            repository: updatedRepository,
        });
         
    } catch (error) {
        console.error("Error during repo creation :", error.message);
        res.status(500).json({ message: "Server error" });
    }
};


const repoController = { createRepository, getAllRepositories, fetchRepositoryById, fetchRepositoryByName, fetchRepositoryForCurrentUser, updateRepositoryById, deleteRepositoryById, toggleVisibilityById };

export default repoController;