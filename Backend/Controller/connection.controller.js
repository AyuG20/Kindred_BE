import { sendConnectionRequest, cancelConnectionRequest, acceptCurrentConnectionRequest } from "../Services/connection.service.js";

export const sendConnectionRequestController = async (req, res) => {
  try {
    const currentUserId = req.user.id;
    const targetUserId = req.params.userId;

    const result = await sendConnectionRequest(currentUserId, targetUserId);

    switch (result.type) {
      case "REQUEST_SENT":
        return res.status(201).json({
          message: "Connection request sent",
          connection: result.connection,
        });
      case "REQUEST_ALREADY_SENT":
        return res.status(409).json({
          message: "Connection request already sent",
          connection: result.connection,
        });
      case "INCOMING_REQUEST":
        return res.status(409).json({
          message: "You already have a pending connection request",
          connection: result.connection,
        });
      case "ALREADY_CONNECTED":
        return res.status(409).json({
          message: "Users are already connected",
          connection: result.connection,
        });
      default:
        return res.status(500).json({
          message: "Unknown connection result",
        });
    }
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const cancelConnectionRequestController = async (req, res) => {
  try {
    const currentUserId = req.user.id;
    const targetUserId = req.params.userId;

    const result = await cancelConnectionRequest(currentUserId, targetUserId);

    if (result) {
      return res.status(200).json({
        message: "Connection request canceled",
      });
    } else {
      return res.status(404).json({
        message: "No pending connection request found",
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const acceptConnectionRequestController = async (req, res) => {
  try {
    const currentUserId = req.user.id;
    const targetUserId = req.params.userId;

    const result = await acceptCurrentConnectionRequest(currentUserId, targetUserId);

    if (result) {
      return res.status(200).json({
        message: "Connection request accepted",
        connection: result,
      });
    } else {
      return res.status(404).json({
        message: "No pending connection request found",
      });
    } 
    
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
