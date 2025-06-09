import { HttpStatus } from "../config/httpStatusCodes.js";

import { userService } from "../services/index.js";

import { comparePassword, hashPassword } from "../utils/hashFunction.js";
import { generateToken, verifyToken } from "../utils/tokenController.js";


export const registerUser = async (req, res, next) => {
    const { email, fullName, password, contactNo} = req.body;

    try {
        console.log('body data : ', req.body)
        
        // Check if required fields are provided
        if (!email || !fullName || !password || !contactNo ) {
            return res.status(HttpStatus.BAD_REQUEST_400).json({ error: 'Please provide all the required information' });
        }

        // Check if user with the provided email already exists
        const existingUser = await userService.getUserByEmailService(email);
          if (existingUser) {
            return res.status(HttpStatus.CONFLICT_409).json({ error: 'User with this email already exists' });
        }
           console.log('Iam Here')

        // Hash the password
           const hashedPassword = await hashPassword(req.body.password);

                 
           // Create new user with hased password
        await userService.createUserService({ email, fullName, password: hashedPassword, contactNo});
        res.json({ message: 'User registered successfully' });
    }
     catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ error: 'Internal server error' });
    };
};

export const loginUser = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await userService.getUserByEmailService(email);
    if (!user) {
      return res.status(HttpStatus.UNAUTHORIZED_401).json({ error: 'Invalid email or password' });
    }

    // Compare hashed password
    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      return res.status(HttpStatus.UNAUTHORIZED_401).json({ error: 'Invalid email or password' });
    }

    // Generate JWT token
    const token = await generateToken({ email: user.email, user_id: user.id, fullName: user.fullName, contactNo: user.contactNo, active: user.active});

    
    // Send the response
    res.json({ message: 'Log in successful', token });

  } catch (error) {
    console.error('Error logging in user:', error);
    res.status(HttpStatus.INTERNAL_SERVER_ERROR_500).json({ error: 'Internal server error' });
  }
};





