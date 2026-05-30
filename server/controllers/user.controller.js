import userModel from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import sendEmail from "../config/sendEmail.js";
import verifyEmailTemplate from "../utils/verifyEmail.js";
import generateAccessToken from "../utils/generateAccessToken.js";
import generateRefreshToken from "../utils/generateRefreshToken.js";

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "All field are required" });
    }
    const user = await userModel.findOne({ email });
    if (user) {
      return res
        .status(400)
        .json({ success: false, message: "User already exits" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashPass = await bcrypt.hash(password, salt);

    const payload = {
      name,
      email,
      password: hashPass,
    };
    const newUser = new userModel(payload);
    const save = await newUser.save();

    const verifyEmailUrl = `${process.env.FRONTEND_URL}/verify-email?code=${save?._id}`;

    await sendEmail({
      sendTo: email,
      subject: "Verify email from E-commerce",
      html: verifyEmailTemplate({ name, url: verifyEmailUrl }),
    });

    return res.status(200).json({
      success: true,
      message: "User register successfully, Please verify your email",
      data: save,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const verifyEmailController = async (req, res) => {
  try {
    const { code } = req.body;

    const user = await userModel.findOne({ _id: code });
    if (!user) {
      return res.status(400).json({ message: "Invalid code", success: false });
    }

    const updateUser = await userModel.updateOne(
      { _id: code },
      { verify_email: true },
    );

    return res.status(200).json({
      success: true,
      message: "Email verifyed, Please verify your email",
      data: save,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "All field are required" });
    }
    const user = await userModel.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }

    if (user.status !== "Active") {
      return res.status(400).json({
        success: false,
        message: "Your account is inactivated, Please contact to admin",
      });
    }

    const checkPassword = await bcrypt.compare(password, user.password);
    if (!checkPassword) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid password" });
    }

    const accessToken = await generateAccessToken(user._id);
    const refreshToken = await generateRefreshToken(user._id);

    const option = {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    };
    res.cookie("accessToken", accessToken, option);
    res.cookie("refreshToken", refreshToken, option);

    return res.status(200).json({
      success: true,
      message: "User login successfully",
      data: {
        accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const logout = async (req, res) => {
  try {
    const userid = req.userId; // comes from auth middleware
    const option = {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    };
    res.clearCookie("accessToken", option);
    res.clearCookie("refreshToken", option);

    const removeRefreshToken = await userModel.findByIdAndUpdate(userid, {
      refresh_token: "",
    });

    return res.status(200).json({
      success: true,
      message: "Logout successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
