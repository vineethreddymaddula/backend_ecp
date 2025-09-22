// src/controllers/auth.controller.ts

import { Request, Response } from "express";
import mongoose from "mongoose"; // Import mongoose to use its types
import User, { IUser } from "../models/user.model";
import generateToken from "../utils/generateToken";

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
export const registerUser = async (req: Request, res: Response) => {
  // CRUCIAL: Destructure variables from the request body
  const { name, email, password } = req.body;

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Use the destructured variables to create the user
    const user = await User.create({ name, email, password });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        // FIX: Assert the type of _id to mongoose.Types.ObjectId before calling .toString()
    token: generateToken(
          ((user._id as unknown) as mongoose.Types.ObjectId).toString(),
          user.role
        ),
      });
    } else {
      throw new Error("User not found after creation");
    }
  } catch (error: any) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

/**
 * @desc    Auth user & get token (Login)
 * @route   POST /api/auth/login
 * @access  Public
 */
export const loginUser = async (req: Request, res: Response) => {
  // CRUCIAL: Destructure variables from the request body
  const { email, password } = req.body;

  try {
    const user: IUser | null = await User.findOne({ email }).select(
      "+password"
    );

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        // FIX: Assert the type of _id to mongoose.Types.ObjectId before calling .toString()
     token: generateToken(
          ((user._id as unknown) as mongoose.Types.ObjectId).toString(),
          user.role
        ),
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error: any) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
