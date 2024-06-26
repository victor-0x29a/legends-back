import express from 'express'
import dotenv from "dotenv";
import { SequelizeAuth, LogsSequelizeAuth } from "./database/connection"
import WebCore from "./web/core";

dotenv.config({
    path: './.env'
})

LogsSequelizeAuth

SequelizeAuth.then(() => {
    new WebCore(Number(process!.env!.port!), express()).start()
}).catch(() => {
    throw new Error("Failed to connect to the database.")
})
