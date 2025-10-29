import express from 'express';
import {borrows, books } from './db.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//נתיב ברירת מחדל
app.get('/', (req, res) => {
  res.send('Hello World!');
});

const port = 5000;
//הפעלת השרת
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
});
//קבלת כל הספרים
app.get('/books', (req, res) => {
    const page = +req.query.page||1 ;
    const limit = +req.query.limit||5;
    const category = req.query.category||'cooking';
    // חישוב אינדקסים לעמודים
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    res.json(books.filter(b => b.category === category).slice(startIndex, endIndex));
  
});


//קבלת ספר לפי קוד
app.get('/books/:id', (req, res) => {
    const book=books.find(b=>b.id===+req.params.id);
    if (book) {
        res.json(book);
    } else {
        res.status(404).send('Book not found');
    }
});
//הוספת ספר חדש
app.post('/books', (req, res) => {
    const newBook = req.body;
    books.push(newBook);
    res.json(books);
});
//עדכון ספר קיים
app.put('/books/:id', (req, res) => {
    const bookIndex = books.findIndex(b => b.id === +req.params.id);
    if (bookIndex !== -1) {
        books[bookIndex] = { ...books[bookIndex], ...req.body };
        res.json(books[bookIndex]);
    } else {
        res.status(404).send('Book not found');
    }
});
//מחיקת ספר
app.delete('/books/:id', (req, res) => {
    const bookIndex = books.findIndex(b => b.id === +req.params.id);
    if (bookIndex !== -1) {
        const deletedBook = books.splice(bookIndex, 1);
        res.json(deletedBook);
    } else {
        res.status(404).send('Book not found');
    }
});
//השאלת ספר
app.patch('/books/:id/borrow', (req, res) => {
    const book=books.find(b=>b.id===+req.params.id)
    const userId=req.body.userId;
    if (!book) {
     res.status(404).send('Book not found');
     return;
  }

  if (book.isBorrowed) {
     res.status(400).send('Book is already borrowed');
     return;
  }
    // סימון הספר כמושאל
    book.isBorrowed = true;
    borrows.push({
      userId,
      borrowDate: new Date().toISOString().split('T')[0] // תאריך היום בפורמט YYYY-MM-DD
    });
    res.send(`Book "${book.name}" borrowed successfully by user ${userId}`);

});
//החזרת ספר
app.patch('/books/:id/return', (req, res) => {
    const book=books.find(b=>b.id===+req.params.id)
    if (!book) {
     res.status(404).send('Book not found');
     return;
  }
    if (!book.isBorrowed) {
        res.status(400).send('Book is not borrowed');
        return;
     }
     book.isBorrowed = false;
     res.send(`Book "${book.name}" returned successfully`);
});
//מחיקת ספר
app.delete('/books/:id', (req, res) => {
    const bookIndex = books.findIndex(b => b.id === +req.params.id);
    if (bookIndex !== -1) {
        const deletedBook = books.splice(bookIndex, 1);
        res.json(books);
    } else {
        res.status(404).send('Book not found');
    }   
});
