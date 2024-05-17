import { Request, Response } from 'express';
import UserModel, { IUser } from '../models/user';

export const createUser = async (req: Request, res: Response) => {
  try {
    const newUser: IUser = req.body;
    newUser.createdAt = new Date(); // Set createdAt timestamp
    newUser.updatedAt = new Date(); // Set updatedAt timestamp
    const createdUser = await UserModel.create(newUser);
    console.log(createUser)
    res.status(201).json(createdUser);
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const user = await UserModel.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const updatedUser: IUser = req.body;
    updatedUser.updatedAt = new Date(); // Update updatedAt timestamp
    const user = await UserModel.findByIdAndUpdate(req.params.id, updatedUser, { new: true });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const deletedUser = await UserModel.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(deletedUser);
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
};