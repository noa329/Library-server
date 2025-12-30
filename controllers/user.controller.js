
import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';


export const sign_up = async (req, res, next) => {
  try {
    const { userName, email } = req.body;

    const existingUser = await User.findOne({
      $and: [{ email }, { userName }]
    });

    if (existingUser) {
      return next({ status: 409, message: 'User already exists' });
    }

    // יצירת משתמש חדש
    const newUser = new User(req.body);
    await newUser.save(); 

    res.status(201).json({
      message: 'User created successfully',
      user: {
        userName: newUser.userName,
        email: newUser.email,
        phone: newUser.phone
      }
    });

  } catch (error) {
    next({ message: error.message });
  }
};

export const sign_in = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return next({ status: 404, message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return next({ status: 401, message: 'Invalid password' });
    }

    res.status(200).json({
      message: 'Login successful',
      user: {
        userName: user.userName,
        email: user.email,
        phone: user.phone,
        Borrowedbooks: user.Borrowedbooks
      }
    });

  } catch (error) {
    next({ message: error.message });
  }
};