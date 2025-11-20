import Joi from 'joi';

export const validateBook = {
    
    
    addBook:Joi.object({
        id: Joi.number().integer().positive().required(),
        name: Joi.string().trim().min(2).required(),
        category: Joi.string().trim().min(2).required(),
        price: Joi.number().positive().required(),
       isBorrowed: Joi.boolean().default(false)
    }),

    updateBook: Joi.object({
    name: Joi.string().trim().min(2),
    category: Joi.string().trim().min(2),
    price: Joi.number().positive(),
    isBorrowed: Joi.boolean()
    }),

    borrowBook: Joi.object({
        userId: Joi.number().integer().positive().required()
    }),
    

}