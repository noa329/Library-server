import { Router } from "express";
import {sign_in,sign_up} from '../controllers/user.controller.js'
import { joiValidator } from "../middlewares/joi-validator.middleware.js";
import { validateUser } from "../models/user.model.js";
const router = Router();

router.post('/sign-in',joiValidator(validateUser.sign_in),sign_in);

router.post('/sign-up',joiValidator(validateUser.sign_up), sign_up) ;
export default router;
