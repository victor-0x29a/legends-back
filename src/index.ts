import express from 'express'
import dotenv from "dotenv";
import WebCore from "./web/core";

dotenv.config({
    path: './.env'
})

new WebCore(Number(process!.env!.port!), express()).start()