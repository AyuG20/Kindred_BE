import bcrypt from "bcrypt";
import UserModel from "../models/UserModel/User.js";
import { signJwt } from "../auth/jwt.js";
import cloudinary from "../utils/cloudinary.js";

export async function registerUser(payload) {
  const { firstName, lastName, email, password } = payload;

  const existingUser = await UserModel.findOne({ email });
  if (existingUser) {
    throw new Error("Email already registered");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await UserModel.create({
    firstName,
    lastName,
    email,
    password: hashedPassword,
    onboardingStatus: "PROFILE",
  });

  const token = signJwt({
    id: user._id.toString(),
    email: user.email,
    role: user.role,
  });

  return {
    token,
    user: {
      id: user._id.toString(),
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      onboardingStatus: user.onboardingStatus,
    },
    message: "User registered successfully",
    status: 201,
    success: true,
  };
}

export async function loginUser(payload) {
  const { email, password } = payload;
  const user = await UserModel.findOne({ email });

  if (!user) {
    throw new Error("Invalid email or password");
  }

  const isValidPassword = await bcrypt.compare(password, user.password);

  if (!isValidPassword) {
    throw new Error("Invalid email or password");
  }

  const token = signJwt({
    id: user._id.toString(),
    email: user.email,
    role: user.role,
  });

  return {
    token,
    user: {
      id: user._id.toString(),
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      onboardingStatus: user.onboardingStatus,
    },
  };
}

export async function uploadProfilePicture(file) {
  if (!file) {
    throw new Error("Profile picture is required");
  }

  const result = await new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "kindered/profile-pictures",
        resource_type: "image",
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      },
    );

    stream.end(file.buffer);
  });

  return {
    url: result.secure_url,
    publicId: result.public_id,
  };
}

export async function updateProfile(userId, file, bio, location) {
  const user = await UserModel.findById(userId);

  if (!user) {
    throw new Error("User not found");
  }

  if (!file) {
    throw new Error("Profile picture is required");
  }

  const profilePicture = await uploadProfilePicture(file);

  user.profilePicture = profilePicture;
  user.bio = bio;
  user.location = location;
  user.onboardingStatus = "INTERESTS";

  await user.save();

  return {
    profilePicture: user.profilePicture,
    bio: user.bio,
    location: user.location,
    onboardingStatus: user.onboardingStatus,
  };
}

export async function getCurrentUser(userId) {
  const user = await UserModel.findById(userId).select("-password");

  if (!user) {
    throw new Error("User not found");
  }

  return user;
}
