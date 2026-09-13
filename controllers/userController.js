import { MongoClient, ReturnDocument } from "mongodb";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import { ObjectId } from "mongodb";

dotenv.config();

let client;

const mongoUri = process.env.MONGO_URI;

async function connectClient() {
    if (!client) {
        client = new MongoClient(mongoUri);
    }
    await client.connect();
}

const signup = async (req, res) => {
    const { username, password, email } = req.body;
    try {
        await connectClient();
        const db = client.db("Git");
        const userCollection = await db.collection("users");
        const user = await userCollection.findOne({ username });
        if (user) {
            return res.status(400).json({ message: "User already exists." });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = {
            username,
            password: hashedPassword,
            email,
            repositories: [],
            followedUsers: [],
            starRepos: []
        }
        const result = await userCollection.insertOne(newUser);
        const token = jwt.sign({ id: result.insertedId }, process.env.JWT_ID, { expiresIn: "1h" });
        res.json({ token });
    } catch (error) {
        console.error("Error during signup :", error.message);
        res.status(500).json({ message: "Server error" });
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        await connectClient();
        const db = client.db("Git");
        const userCollection = await db.collection("users");
        const user = await userCollection.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid crefential." });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid crefential." });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_ID, { expiresIn: "1h" });
        res.json({ token, userId: user._id });
    } catch (e) {
        console.log("Error in login: ", e.message);
        res.status(500).send("Server Error");
    }
};


const getAllUser = async (req, res) => {
    try {
        await connectClient();
        const db = client.db("Git");
        const userCollection = await db.collection("users");

        const users = await userCollection.find({}).toArray();
        res.json(users);
    } catch (e) {
        console.log("Error in fetching: ", e.message);
        res.status(500).send("Server Error");
    }
};


const getUserProfile = async (req, res) => {
    const currentID = req.params.id;
     try {
        await connectClient();
        const db = client.db("Git");
        const userCollection = await db.collection("users");

        const user = await userCollection.findOne({_id:new ObjectId(currentID)});
         if (!user) {
            return res.status(404).json({ message: "User not found."});
        }
        res.status(200).json(user);
    } catch (e) {
        console.log("Error in fetching: ", e.message);
        res.status(500).send("Server Error");
    }
};

const updateUserProfile = async (req, res) => {
    const currentID = req.params.id;
    const {email,password} = req.body;
    try {
        await connectClient();
        const db = client.db("Git");
        const userCollection = await db.collection("users");
         let updatedField = {};

        if (email) {
            updatedField.email = email;
        }
        if(password){
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password,salt);
            updatedField.password = hashedPassword;
        }
        const result = await userCollection.findOneAndUpdate(
            {_id: new ObjectId(currentID)},
            {$set: updatedField},
            {returnDocument: "after"}
        );
        if(!result){
            return res.status(404).json({message: "User not found!"});
        }
        res.json(result);
    } catch (e) {
        console.log("Error in updating: ", e.message);
        res.status(500).send("Server Error");
    }
};

const deleteUserProfile = async (req, res) => {
    const currentID = req.params.id;
    try{
        await connectClient();
        const db = client.db("Git");
        const userCollection = await db.collection("users");
        const result = await userCollection.deleteOne({
            _id : new ObjectId(currentID)
        })

        if(!result.deleteCount == 0){
            return res.status(404).json({message: "User not found!"});
        }
        res.json({message:"User deleted"});
    }catch (e) {
        console.log("Error in fetching: ", e.message);
        res.status(500).send("Server Error");
    }
};

const userController = { getAllUser, signup, login, getUserProfile, updateUserProfile, deleteUserProfile };


export default userController;