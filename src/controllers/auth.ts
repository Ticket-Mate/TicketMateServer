import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/user';
import ms from 'ms';
import dayjs from 'dayjs';

const register = async (req: Request, res: Response) => {
  const { firstName, lastName, email, password, phone } = req.body;

  if (!email || !password || !firstName || !lastName || !phone) {
    return res.status(400).json({ error: "Missing parameters in body request" });
  }

  try {
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(406).json({ error: "Email already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = await User.create({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      phone,
      createdAt: new Date(),
    });

    return res.status(201).json(newUser);
  } catch (error) {
    return res.status(500).json({ error: "Server error during registration" });
  }
};

const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Missing email or password" });
  }

  try {
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: "Email or password incorrect" });
    }

    const accessToken = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRATION,
    });
    const refreshToken = jwt.sign({ _id: user._id }, process.env.JWT_REFRESH_SECRET);

    user.refreshTokens = user.refreshTokens ? [...user.refreshTokens, refreshToken] : [refreshToken];
    await user.save();

    
    return res.status(200).json({
      _id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      accessToken,
      refreshToken,
      refreshTokenInterval: ms(process.env.JWT_EXPIRATION),
      lastRefreshTime: dayjs().format()
    });
  } catch (error) {
    return res.status(500).json({ error: "Server error during login" });
  }
};

const logout = async (req: Request, res: Response) => {
  const authHeader = req.headers['authorization'];
  const refreshToken = authHeader?.split(' ')[1];
  
  if (!refreshToken) return res.sendStatus(401);

  jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, async (err, decoded: any) => {
    if (err) return res.sendStatus(403);

    try {
      const user = await User.findById(decoded._id);
      if (!user || !user.refreshTokens.includes(refreshToken)) {
        return res.sendStatus(403);
      }

      user.refreshTokens = user.refreshTokens.filter(token => token !== refreshToken);
      await user.save();

      return res.sendStatus(200);
    } catch (error) {
      return res.sendStatus(500).json({ error: "Server error during logout" });
    }
  });
};

const refresh = async (req: Request, res: Response) => {
  const authHeader = req.headers['authorization'];
  const refreshToken = authHeader?.split(' ')[1];
  
  if (!refreshToken) return res.sendStatus(401);

  jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, async (err, decoded: any) => {
    if (err) return res.sendStatus(403);

    try {
      const user = await User.findById(decoded._id);
      if (!user || !user.refreshTokens.includes(refreshToken)) {
        return res.sendStatus(403);
      }

      const newAccessToken = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRATION,
      });
      const newRefreshToken = jwt.sign({ _id: user._id }, process.env.JWT_REFRESH_SECRET);

      user.refreshTokens = user.refreshTokens.filter(token => token !== refreshToken).concat(newRefreshToken);
      await user.save();

      return res.status(200).json({
        _id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
        refreshTokenInterval: ms(process.env.JWT_EXPIRATION),
        lastRefreshTime: dayjs().format()
      });
    } catch (error) {
      return res.status(500).json({ error: "Server error during token refresh" });
    }
  });
};

export default {
  register,
  login,
  logout,
  refresh,
};