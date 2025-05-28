const User = require("../models/user-model")
const bycrypt = require("bcryptjs")
const jwt = require('jsonwebtoken');
const Joi = require('joi');

const register = async (req, res, next) => {
    try {
        const schema = Joi.object({
            username: Joi.string().min(3).required().messages({
                "string.min": "Username must be at least 3 characters long",
                "any.required": "Username is required"
            }),
            email: Joi.string().email().required().messages({
                "string.email": "Invalid email format",
                "any.required": "Email is required"
            }),
            phone: Joi.string().pattern(/^\d{10,15}$/).required().messages({
                "string.pattern.base": "Phone number must contain only digits and be between 10 and 15 digits",
                "any.required": "Phone number is required"
            }),
            password: Joi.string().min(6).required().messages({
                "string.min": "Password must be at least 6 characters long",
                "any.required": "Password is required"
            })
        });

        const { error } = schema.validate(req.body, { abortEarly: false });

        if (error) {
            const errors = error.details.reduce((acc, err) => {
                acc[err.path[0]] = err.message;
                return acc;
            }, {});
            return res.status(400).json({ errors });
        }

        const { username, email, phone, password } = req.body;

        // Check if user with the same email exists
        const userExist = await User.findOne({ email: email });
        if (userExist) {
            return res.status(400).json({ message: "Email already exists" });
        }

        // Check if user with the same username exists
        const usernameExist = await User.findOne({ username: username });
        if (usernameExist) {
            return res.status(400).json({ message: "Username taken" });
        }

        // Create the user
        const userCreated = await User.create({ username, email, phone, password });

        // Generate a token
        //const token = await userCreated.generateToken();

        // Send the success response
        // res.status(201).json({
        //     message: "Registration successful",
        //     token: token,
        //     userId: userCreated._id.toString()
        // });

        res.status(201).json({message:"Registration successful", 
                        token: await userCreated.generateToken(),
                        userId:userCreated._id.toString() 
                    });

    } catch (error) {
        console.log("Error in reg Page", error);
        next(error);
    }
};



const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const userExist = await User.findOne({ email: email });

        if (!userExist) {
            return res.status(400).json({ message: "Invalid Credentials" });
        }

        // Check if the password is correct
        const isMatch = await bycrypt.compare(password, userExist.password); 

        if (isMatch) {
            // Generate token only if credentials are valid
            const token = await userExist.generateToken(); // Ensure generateToken is defined in your User model

            return res.status(200).json({
                message: "Login successful",
                token: token,
                userId: userExist._id.toString(),
                
            });
        } else {
            return res.status(401).json({ message: "Invalid email or password" });
        }
    } catch (error) {
        console.log("Error in login Page", error);
        return res.status(500).json({ message: "Server Error" }); // Respond with server error
    }
};



const user = async(req,res) => {
     
    try{
         const userData = req.user;
         console.log(userData);
         return res.status(200).json({userData});
        // res.status(200).json({message:"Hi user"});
    }

    catch(error){
        console.log('User Error', error);
    }
}






module.exports = {  register, login, user };


 