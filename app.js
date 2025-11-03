import express from 'express';
import {borrows, books } from './db.js';
import {users} from './user.js';


import bookRouter from './routes/book.route.js'
import userRouter from './routes/user.route.js'


const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//נתיב ברירת מחדל
app.get('/', (req, res) => {
  res.json('Hello World!');
});
app.use('/books',bookRouter);
app.use('/users', userRouter);

const port = 5000;
//הפעלת השרת
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
});
