import { Router } from "express";
import {addBook,deleteBook,updateBook,getAllBooks,getBookById,borrowBook,returnBook}from "../controllers/book.controller.js"
import { joiValidator } from "../middlewares/joi-validator.middleware.js";
import { validateBook } from "../models/book.model.js";

const router = Router();
//קבלת כל הספרים
router.get('', getAllBooks) ;


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
export default router;
