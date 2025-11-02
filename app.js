import express from 'express';
import {borrows, books } from './db.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//נתיב ברירת מחדל
app.get('/', (req, res) => {
  res.json('Hello World!');
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
        res.status(404).json('Book not found');
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
        res.status(202).json();
    } else {
        res.status(404).json('Book not found');
    }
});
//מחיקת ספר
app.delete('/books/:id', (req, res) => {
    const bookIndex = books.findIndex(b => b.id === +req.params.id);
    if (bookIndex !== -1) {
        const deletedBook = books.splice(bookIndex, 1);
        res.json(deletedBook);
        res.status(204).end();
    } 
    else {
        res.status(404).json('Book not found');
    }
});
//השאלת ספר
app.patch('/books/:id/borrow', (req, res) => {
    const book=books.find(b=>b.id===+req.params.id)
    const userId=req.body.userId;
    if (!book) {
    return res.status(404).json('Book not found');
     
  }

  if (book.isBorrowed) {
    return res.status(400).json('Book is already borrowed');
     
  }
    // סימון הספר כמושאל
    book.isBorrowed = true;
    borrows.push({
      userId,
      borrowDate: new Date().toISOString().split('T')[0] // תאריך היום בפורמט YYYY-MM-DD
    });
    res.json(`Book "${book.name}" borrowed successfully by user ${userId}`);

});
//החזרת ספר
app.patch('/books/:id/return', (req, res) => {
    const book=books.find(b=>b.id===+req.params.id)
    if (!book) {
     return res.status(404).json('Book not found');
     
  }
    if (!book.isBorrowed) {
       return res.status(400).json('Book is not borrowed');
        
     }
     book.isBorrowed = false;
     res.json(`Book "${book.name}" returned successfully`);
});
//מחיקת ספר
app.delete('/books/:id', (req, res) => {
    const bookIndex = books.findIndex(b => b.id === +req.params.id);
    if (bookIndex !== -1) {
        const deletedBook = books.splice(bookIndex, 1);
        res.json(books);
    } else {
        res.status(404).json('Book not found');
    }   
});
