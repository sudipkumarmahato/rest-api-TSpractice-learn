import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import http from 'http';
import mongoose from 'mongoose';
import morgan from 'morgan';
import dotenv from 'dotenv';
dotenv.config();

import router from './routes';
const app = express();

app.use(
    cors({
        credentials: true
    })
);
app.use(compression());
app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser.json());

const server = http.createServer(app);

const port = process.env.SERVER_PORT || process.env.DEFAULT_PORT;
const db = process.env.MONGOURI;

mongoose
    .connect(db)
    .then(() => {
        server.listen(port, () => {
            console.log(
                `DB Connected and Server listening on port ${port} Successfully`
            );
        });
    })
    .catch((err) => {
        console.log(err);
    });


app.use("/", router())

// server.listen(port, () => {
//   console.log(`Server listening on port ${port}`);
// });
