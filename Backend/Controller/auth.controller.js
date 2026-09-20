import { loginUser, registerUser, updateProfile, getCurrentUser} from "../Services/auth.service.js";


export async function registerController(req, res) {
  try {
    const payload = req.body;
    const result = await registerUser(payload);
    console.log("TOKEN:", result.token);
    console.log("res.cookie exists:", typeof res.cookie);
    res.cookie("accessToken", result.token, {
      httpOnly: true,
      secure: false,
      path: "/",
      sameSite: "lax",
      maxAge: 60 * 60 * 1000,
    });
    return res.status(201).json({
      success: result.success,
      message: result.message,
      user: result.user,
    });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
}

export async function loginController(req, res) {
  try {
    const payload = req.body;
    const result = await loginUser(payload);
    res.cookie("accessToken", result.token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 1000,
    });
    return res.status(200).json({
      success: result.success,
      message: result.message,
      user: result.user,
    });
  } catch (error) {
    return res.status(401).json({ error: error.message });
  }
}



export async function updateProfileController(req, res) {
  try {
    const userId = req.user.id;
    const file = req.file;
    const { bio, location } = req.body;

    const result = await updateProfile(
      userId,
      file,
      bio,
      location
    );

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      ...result,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}


export async function getCurrentUserController(req, res) {
  try {
    const userId = req.user.id;
    const user = await getCurrentUser(userId);
    return res.status(200).json({
      success: true,
      message: "User profile retrieved successfully",
      user: user,
    });
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
}
