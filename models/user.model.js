import Joi from 'joi';

export const validateUser = {
    //user sign in (email,password)
   sign_in:Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required()
   }),
   //user sigin(userName, email, password)
    sign_up:Joi.object({
       userName: Joi.string().trim().min(3).required(),
        email: Joi.string().email().required(),
        password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
    }),
};