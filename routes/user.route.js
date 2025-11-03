import { Router } from "express";
import { users } from '../user.js';

const router = Router();

router.post('/sign-up', (req, res) => {
 const { userName, email, password } = req.body;

  const existingUser = users.find( u => u.email === email || u.userName === userName);

  if (existingUser) {
    return res.status(409).json('User already exists'); 
  }

    const newuser = req.body;
    users.push(newuser);
    res.status(201).json(newuser);
});

router.post('/sign-in', (req, res) => {
   const { email, password } = req.body;
  const user = users.find(u => u.email === email);
  if (!user) {
    return res.status(404).json('User not found');
  }

  if (user.password !== password) {
    return res.status(401).json('Invalid password'); 
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
});