import {Book} from '../models/book.model.js'
import { users } from '../user.js';
import {isValidObjectId} from "mongoose"

export const uploadBookImage = (req, res, next) => {
  const book = books.find(b => b.id === +req.params.id);
  if (!book) return next({ status: 404, message: 'Book not found' });

  if (!req.file) return next({ status: 400, message: 'No file uploaded' });

  book.image = `/images/${req.file.filename}`;
  res.status(201).json({ message: 'Image uploaded', book });
};

//קבלת כל הספרים
export const getAllBooks=async (req, res,next) => {
   try {

     const { page = 1, limit = 5, categories ='' } = req.query;
      const result = await Book.find({categories : new RegExp(categories, 'i') })
            .skip((page - 1) * limit) 
            .limit(limit);
       res.json(result)     
   } catch (error) {
     next({});
   }
    
};


//קבלת ספר לפי קוד
export const getBookById=async (req, res,next) => {
    const {id}=req.params;
    try {
         if (!isValidObjectId(id)) {
            return next({ status: 404, message: `Book ${id} not found!` });
        }
         const p = await Book.findById(id);
          if (!p) {
            return next({ status: 404, message: `Book ${id} not found!` });
          }
          res.json(p);
    } catch (error) {
        next({ message: error.message });
    }
};
//הוספת ספר חדש
export const addBook= async (req, res,next) => {
    try {
        const newBook= await Book.create(req.body);
        res.status(201).json(newBook);
    } catch (error) {
       if (error.name === "ValidationError") {
      next({ status: 400, message: error.message }); // שגיאת client
    } else {
         next({ message: error.message });
    }
    }
};
//עדכון ספר קיים
export const updateBook=async (req, res,next) => {
   const {id}=req.params;
    try {
         if (!isValidObjectId(id)) {
            return next({ status: 404, message: `Book ${id} not found!` });
        }
         const p = await Book.findByIdAndUpdate(id,req.body,{new:true,runValidators:true});
          if (!p) {
            return next({ status: 404, message: `Book ${id} not found!` });
          }
        res.json(p)
    } catch (error) {
        if (error.name === "ValidationError") {
      next({ status: 400, message: error.message }); // שגיאת client
    } else {
         next({ message: error.message });
    }
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
export const deleteBook=async (req, res,next) => {
    const {id}=req.params;
    try {
         if (!isValidObjectId(id)) {
      return next({ status: 404, message: `Book ${id} not found!` });
    }
        const deletedBook=await Book.findByIdAndDelete(id);
        if (!deletedBook) {
      return next({ status: 404, message: `Book ${id} not found!` });
    }

    res.status(200).json({ message: `Book "${deletedBook.name}" deleted successfully.` });
    } catch (error) {
         if (error.name === "ValidationError") {
      next({ status: 400, message: error.message }); // שגיאת client
    } else {
         next({ message: error.message });
    }
    }
};
export const getBooksByCategory = async (req, res, next) => {
  const { category } = req.params; 

  try {
    const books = await Book.find({ categories: category });

    if (!books.length) {
      return next({ status: 404, message: `No books found in category "${category}"` });
    }

    res.json(books);
  } catch (error) {
    next({ });
  }
};