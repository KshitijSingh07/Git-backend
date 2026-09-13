import AWS from "aws-sdk";
import dotenv from "dotenv";
dotenv.config();
AWS.config.update({region:"ap-south-1" , accessKeyId: process.env.ACCESSKEYID , secretAccessKey: process.env.SECRETACCESSKEY});

const s3 = new AWS.S3();

const S3_BUCKET = "samplekjbucket";

export {s3, S3_BUCKET};