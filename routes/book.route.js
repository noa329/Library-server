import { Router } from "express";
import {addBook,deleteBook,updateBook,getAllBooks,getBookById,borrowBook,returnBook,uploadBookImage,getBooksByCategory}from "../controllers/book.controller.js"
import { joiValidator } from "../middlewares/joi-validator.middleware.js";
import { validateBook } from "../models/book.model.js";
import { upload } from '../middlewares/multerConfig.js';

const router = Router();
//קבלת כל הספרים
router.get('', getAllBooks) ;
// העלאת תמונה לספר לפי ID
router.post('/:id/image', upload.single('image'), uploadBookImage);
//קבלת ספר לפי קוד
router.get('/:id',getBookById);
//הוספת ספר חדש
router.post('', joiValidator(validateBook.addBook),addBook) ;
//עדכון ספר קיים
router.put('/:id', joiValidator(validateBook.updateBook),updateBook) ;

//השאלת ספר
router.patch('/:id/borrow',joiValidator(validateBook.borrowBook), borrowBook) ;
   
//החזרת ספר
router.patch('/:id/return',returnBook);
//מחיקת ספר
router.delete('/:id',deleteBook);
//קבלת ספרים לפי קטגוריה
router.get('/category/:category',getBooksByCategory);
export default router;
