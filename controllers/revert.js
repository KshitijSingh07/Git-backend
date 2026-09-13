import path from "path";
import fs from "fs";
import { promisify } from "util";

const readdir = promisify(fs.readdir);
const copyFile = promisify(fs.copyFile)
async function revertRepo(commitID) {
    const repoPath = path.resolve(process.cwd(), ".apnaGit");
    const commitsPath = path.join(repoPath, "commits");

    try {
        const commitDir = path.join(commitsPath, commitID);
        const files = await readdir(commitDir);
        const parentDir = path.join(repoPath, "..");

        for(const file of files){
            await copyFile(path.join(commitDir, file), path.join(parentDir,file));
        }

        console.log(`Commit ${commitID} reverted.`);
    } catch (e) {
        console.log("Error in reverting: ", e);
    }
  
}

export default revertRepo;