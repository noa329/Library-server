import mongoose from "mongoose";
import Joi from 'joi';

export const validateBook = {
    
    
    addBook:Joi.object({
        name: Joi.string().trim().min(2).required(),
        price: Joi.number().positive().required(),
        categories: Joi.array().items(Joi.string().trim()).default([]), // מערך אופציונלי
    author: Joi.object({
      name: Joi.string().trim().min(2).required(), 
      phone: Joi.string().trim().optional(),        
      email: Joi.string().trim().email().optional() 
    }).required(), 
       isBorrowed: Joi.boolean().default(false)
    }),

    updateBook: Joi.object({
    name: Joi.string().trim().min(2),
    price: Joi.number().positive(),
    categories: Joi.array().items(Joi.string().trim()),
    author: Joi.object({
      name: Joi.string().trim().min(2),
      phone: Joi.string().trim(),
      email: Joi.string().trim().email()
    }),
    isBorrowed: Joi.boolean()
    }),

    borrowBook: Joi.object({
        userId: Joi.number().integer().positive().required()
    }),
    
}
const bookSchema = new mongoose.Schema({
   
   name: { type: String, required: true,minlength: 2,maxlength: 20},
  price: { type: Number, required: true,min:0},
  categories: { type: [String], default: [] },
  author: {
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true }
  },
  isBorrowed: { type: Boolean, default: false }}
  , {
   versionKey: false // כאן זה המקום הנכון
  }  
 );
 export const Book = mongoose.model("Book", bookSchema);

   