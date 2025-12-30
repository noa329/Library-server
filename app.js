import express from 'express';
import { config } from 'dotenv';

config();
import { addRequestDate, printDateGET } from './middlewares/Date.middlewares.js';
import {createBlockDays} from './middlewares/blockDays.middleware.js';
import {errorHandler ,notFoundHandler} from './middlewares/errors.middleware.js';


import bookRouter from './routes/book.route.js'
import userRouter from './routes/user.route.js'
import cors from 'cors';
import morgan from 'morgan';
import { connectDB } from './config/db.js';


const app = express();

connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(morgan('dev'));
app.use(cors());

app.use(addRequestDate);
app.use(createBlockDays());
app.use(printDateGET);
app.use(express.static('public'));

//נתיב ברירת מחדל
app.get('/', (req, res) => {
  res.json('Hello World!');
});
app.use('/books',bookRouter);
app.use('/users', userRouter);


app.use(notFoundHandler);
app.use(errorHandler);

const port = process.env.PORT??3000 ;
//הפעלת השרת
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
});
