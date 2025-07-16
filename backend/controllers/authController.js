import cloudinary from "../lib/cloudinary.js";
import bcrypt from "bcryptjs";
import { generateTokens, setCookies } from "../helpers/authentication.js";
import User from "../models/userModel.js";

export const SignUp = async  (req, res) => {
  try {

    const  {  username, password, email, profilePicture , role  } = req.body;
    if ( !username || !password || !email || !role ) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const existingUser = await User.findOne({ email }).select("-password");

    if (existingUser) {
    return res.status(400).json({ message: "User already exists" });
    }

    let  cloudinaryResponse = null

    if (profilePicture) {
      const uploadResponse = await cloudinary.uploader.upload(profilePicture)
      cloudinaryResponse = uploadResponse.secure_url;
    }

    const newUser = new User({
      username,
      password,
      email,
      role,
      profilePicture : cloudinaryResponse?.secure_url ? cloudinaryResponse?.secure_url : "no profile picture",
    });

    const {accessToken} = generateTokens(newUser._id);
    setCookies(res, accessToken);


    newUser.accessToken = accessToken; 

    await newUser.save();

    res.status(201).json({ message: "User created successfully" , newUser});    
  } catch (error) {
    console.error("Error in SignUp function: ", error);
    res.status(500).json({ message: error.message });
  }
}



export const SignIn = async (req, res) => {
  try {
  
    const { email , password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(400).json({ message: "INVALID CREDENTIALS - BOTH EMAIL AND PASSWORD IS INCORRECT" });
    }


    const comparePassword = await bcrypt.compare(password, user.password);

    if (!comparePassword) {
      return res.status(400).json({ message: "INVALID CREDENTIALS - BOTH EMAIL AND PASSWORD IS INCORRECT" });
    }


    const {accessToken} = generateTokens(user._id);
     setCookies(res, accessToken);
    
    const userData = {
      _id: user._id,
      username: user.username,
      email: user.email,
      role : user.role,
      profilePicture: user.profilePicture,
    };


    res.status(200).json({ message: "User signed in successfully", user: userData });
  } catch (error) {
     console.error("message happening in sign in function " , error)
     res.status(500).json({ message: error.message });
  }
}

export const WhoAmI = async (req, res ) => {
  try {

    const user = req.user;

    if (!user) {
      return res.status(401).json({ message: "unauthorized - User not found" });
    }

    const userData = {
      username: user.username,
      email : user.email,
      profilePicture: user.profilePicture,
      _id: user._id,
    }

    res.status(200).json({ message: "User found successfully", user: userData });
    
  } catch (error) {
    console.error("Error in WhoAmI function: ", error);
    res.status(500).json({ message: error.message });
  }
}


export const LogOut = async (req, res) => {
  try {
    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
    });

    res.status(200).json({ message: "User logged out successfully" });
  } catch (error) {
    console.error("Error in LogOut function: ", error);
    res.status(500).json({ message: error.message });
  }
};
