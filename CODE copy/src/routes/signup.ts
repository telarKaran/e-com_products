import express from 'express';
import { body } from 'express-validator';
import { validateRequest } from '@shopmaster360/shared';
import { signup } from '../controllers/authController';

const router = express.Router();

router.post(
  '/api/users/signup',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Email must be valid'),
    body('password')
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage('Password must be between 4 and 20 characters')
  ],
  validateRequest,
  signup
);

export { router as signupRouter };
