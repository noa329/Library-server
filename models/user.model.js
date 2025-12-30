import Joi from 'joi';
import { Schema ,model} from 'mongoose';
import bcrypt from 'bcryptjs';

export const validateUser = {
    //user sign in (email,password)
   sign_in:Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required()
   }),
   //user sign up (userName, email, password)
    sign_up:Joi.object({
       userName: Joi.string().trim().min(3).required(),
        email: Joi.string().email().required(),
        password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
        repeat_password:  Joi.string().valid(Joi.ref('password')).required(),
        phone: Joi.string() .trim().pattern(/^0[0-9]{9}$/).required(),
    
    }),
};

const userSchema= new Schema({
    userName: String,
    email:{type: String, unique: true},
    password: String,
    phone: String,

});

userSchema.pre('save',async function() {

  if (!this.isModified('password')) {
    return ;
  }

  const salt = await bcrypt.genSaltSync(Number(process.env.SALT_ROUNDS)|| 12);
  this.password = await bcrypt.hashSync(this.password, salt);
});

export default  model('User',userSchema);
 