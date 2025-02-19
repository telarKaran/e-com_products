import express from 'express';
import { body } from 'express-validator';
import { validateRequest } from '@shopmaster360/shared';
import { signin } from '../controllers/authController';

const router = express.Router();

router.post(
  '/api/users/signin',
  [
    body('email').isEmail().withMessage('Email must be valid'),
    body('password').trim().notEmpty().withMessage('You must supply a password')
  ],
  validateRequest,
  signin
);

export { router as signinRouter };
