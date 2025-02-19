import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { BadRequestError, NotAuthorizedError } from '@shopmaster360/shared';
import { Password } from '../services/password';
import { User } from '../models/user';


// User Signin Controller

export const signin = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const existingUser = await User.findOne({ email });
  if (!existingUser) {
    throw new BadRequestError('Invalid credentials');
  }

//   Future implentation
//   if (!existingUser.isVerified) {
//     throw new NotAuthorizedError();
//   }

  const passwordsMatch = await Password.compare(existingUser.password, password);
  if (!passwordsMatch) {
    throw new BadRequestError('Invalid Credentials');
  }

  
  const userJwt = jwt.sign(
    { id: existingUser.id, email: existingUser.email },
    process.env.JWT_KEY!
  );

  req.session = { jwt: userJwt };

  res.status(200).send({
    message: 'Login successful',
    user: {
      id: existingUser.id,
      name: existingUser.name,
      email: existingUser.email,
      role: existingUser.role
    }
  });
};

//  * User Signup Controller

export const signup = async (req: Request, res: Response) => {  
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });
  
    if (existingUser) {
      throw new BadRequestError('Email is already in use');
    }
    
    try {
      const user = User.build({ name, email, password, role: 'customer' });
  
      await user.save();  
      const userJwt = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        process.env.JWT_KEY!,
        { expiresIn: '10d' }
      );
  
      req.session = { jwt: userJwt };
  
      res.status(201).send({
        message: 'User registered successfully',
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      });
    } catch (err) {
      console.error('ERROR: User save failed:', err);
      throw new BadRequestError('User creation failed');
    }
  };

// User Signout Controller

export const signout = (req: Request, res: Response) => {
  req.session = null;
  res.status(200).send({ message: 'User signed out successfully' });
};
