
import { discoverUsers } from "../Services/discovery.service.js";


export const discoverUsersController = async (req, res) => {
  try {
    const userId = req.user.id;
    const {interestId} = req.query;

    const result = await discoverUsers(userId, interestId);

    res.status(200).json({
      result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};