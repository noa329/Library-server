import { Router } from "express";
import { books, borrows } from '../db.js';
import { users } from '../user.js';

const router = Router();
//קבלת כל הספרים
router.get('', (req, res) => {
    const page = +req.query.page||1 ;
    const limit = +req.query.limit||5;
    const category = req.query.category||'cooking';
    // חישוב אינדקסים לעמודים
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    res.json(books.filter(b => b.category === category).slice(startIndex, endIndex));
  
});


//קבלת ספר לפי קוד
router.get('/:id', (req, res) => {
    const book=books.find(b=>b.id===+req.params.id);
    if (book) {
        res.json(book);
    } else {
        res.status(404).json('Book not found');
    }
});
//הוספת ספר חדש
router.post('', (req, res) => {
    const newBook = req.body;
    books.push(newBook);
    res.status(201).json(books);
});
//עדכון ספר קיים
router.put('/:id', (req, res) => {
    const bookIndex = books.findIndex(b => b.id === +req.params.id);
    if (bookIndex !== -1) {
        books[bookIndex] = { ...books[bookIndex], ...req.body };
        res.status(202).json();
    } else {
        res.status(404).json('Book not found');
    }
});

//השאלת ספר
router.patch('/:id/borrow', (req, res) => {
    const book=books.find(b=>b.id===+req.params.id)
    const user=users.find(u=>u.code===+req.body.userId) ;
    if (!book) {
    return res.status(404).json('Book not found');
    }
   if (!user) {
    return res.status(404).json('User not found');
   }
  

  if (book.isBorrowed) {
    return res.status(400).json('Book is already borrowed');
     
  }
    // סימון הספר כמושאל
    book.isBorrowed = true;
    borrows.push({
      userId: +req.body.userId,
      borrowDate: new Date().toISOString().split('T')[0] // תאריך היום בפורמט YYYY-MM-DD
    });
    user.Borrowedbooks.push(req.params.id);
    res.status(202).json(`Book "${book.name}" borrowed successfully by user ${user.userName}`);

});
//החזרת ספר
router.patch('/:id/return', (req, res) => {
    const book=books.find(b=>b.id===+req.params.id)
    const user=users.find(u=>u.Borrowedbooks.some(x=>x==+req.params.id))
    if (!book) {
     return res.status(404).json('Book not found');
     
  }
    if (!book.isBorrowed) {
       return res.status(400).json('Book is not borrowed');
        
     }
     book.isBorrowed = false;
     const index = user.Borrowedbooks.findIndex(x=>x==+req.params.id);
    if (index !== -1) {
     user.Borrowedbooks.splice(index, 1);
    }

     res.status(202).json(`Book "${book.name}" returned successfully`);
});
//מחיקת ספר
router.delete('/:id', (req, res) => {
    const bookIndex = books.findIndex(b => b.id === +req.params.id);
    if (bookIndex !== -1) {
        const deletedBook = books.splice(bookIndex, 1);
        res.status(204).end();
    } 
    else {
        res.status(404).json('Book not found');
    }
});