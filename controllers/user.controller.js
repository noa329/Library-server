import { users } from '../user.js';

 export const sign_up=(req, res,next) => {
 const { userName, email, password } = req.body;

  const existingUser = users.find( u => u.email === email || u.userName === userName);

  if (existingUser) {
     return  next({ status: 409, message: 'User already exists' });
  }

    const newuser = req.body;
    users.push(newuser);
    res.status(201).json(newuser);
};

export const sign_in=(req, res,next) => {
   const { email, password } = req.body;
  const user = users.find(u => u.email === email);
  if (!user) {
      return  next({ status: 404, message:'User not found'});
  }

  if (user.password !== password) {
    return  next({ status: 401, message: 'Invalid password'});
  }

  res.status(200).json({
    message: 'Login successful',
    user: {
      code: user.code,
      userName: user.userName,
      email: user.email,
      Borrowedbooks: user.Borrowedbooks
    }
  });
};