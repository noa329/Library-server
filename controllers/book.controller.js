import { books, borrows } from '../db.js';
import { users } from '../user.js';

//קבלת כל הספרים
export const getAllBooks=(req, res) => {
     const { page = 1, limit = 5, category = 'cooking' } = req.query;
    // חישוב אינדקסים לעמודים
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    res.json(books.filter(b => b.category === category).slice(startIndex, endIndex));
  
};


//קבלת ספר לפי קוד
export const getBookById=(req, res,next) => {
    const book=books.find(b=>b.id===+req.params.id);
    if (book) {
        res.json(book);
    } else {
        return next({ status: 404, message:'Book not found' });
    }
};
//הוספת ספר חדש
export const addBook= (req, res) => {
    const newBook = req.body;
    books.push(newBook);
    res.status(201).json(books);
};
//עדכון ספר קיים
export const updateBook=(req, res,next) => {
    const bookIndex = books.findIndex(b => b.id === +req.params.id);
    if (bookIndex !== -1) {
        books[bookIndex] = { ...books[bookIndex], ...req.body };
        res.status(204).json();
    } else {
       return  next({ status: 404, message: 'Book not found'});
    }
};

//השאלת ספר
export const borrowBook= (req, res,next) => {
    const book=books.find(b=>b.id===+req.params.id)
    const user=users.find(u=>u.code===+req.body.userId) ;
    if (!book) {
    return next({ status: 404, message: 'Book not found' });
    }
   if (!user) {
     return next({ status: 404, message: 'User not found' });
   }
  

  if (book.isBorrowed) {
     return next({ status: 404, message: 'Book is already borrowed' });
     
  }
    // סימון הספר כמושאל
    book.isBorrowed = true;
    borrows.push({
      userId: +req.body.userId,
      borrowDate: new Date().toISOString().split('T')[0] // תאריך היום בפורמט YYYY-MM-DD
    });
    user.Borrowedbooks.push(+req.params.id);
    res.status(202).json(`Book "${book.name}" borrowed successfully by user ${user.userName}`);

};
//החזרת ספר
export const returnBook= (req, res,next) => {
    const book=books.find(b=>b.id===+req.params.id)
    const user=users.find(u=>u.Borrowedbooks.some(x=>x==+req.params.id))
    if (!book) {
      return next({ status: 404, message:'Book not found'  });
     
  }
    if (!book.isBorrowed) {
       return  next({ status: 404, message:  'Book is not borrowed'});
        
     }
     book.isBorrowed = false;
     const index = user.Borrowedbooks.findIndex(x=>x==+req.params.id);
    if (index !== -1) {
     user.Borrowedbooks.splice(index, 1);
    }

     res.status(202).json(`Book "${book.name}" returned successfully`);
};
//מחיקת ספר
export const deleteBook=(req, res,next) => {
    const bookIndex = books.findIndex(b => b.id === +req.params.id);
    if (bookIndex !== -1) {
         books.splice(bookIndex, 1);
        res.status(204).end();
    } 
    else {
        return  next({ status: 404, message: 'Book not found' });
    }
};