import ConnectionModel from "../models/ConnectionModel/connection.js";

export async function sendConnectionRequest(currentUserId, targetUserId) {
  const [userA, userB] = [currentUserId, targetUserId].sort();

  if (!currentUserId || !targetUserId) {
    throw new Error("Such user does not exist");
  }

  if (currentUserId.toString() === targetUserId.toString()) {
    throw new Error("Something wrong");
  }

  const connection = await ConnectionModel.findOne({ userA, userB });

  if (!connection) {
    const newConnection = await ConnectionModel.create({
      userA,
      userB,
      requestedBy: currentUserId,
      status: "pending",
    });

    return {
        type: "REQUEST_SENT",
        connection: newConnection};
  }

  if (connection.status === "pending") {
    if (connection.requestedBy.toString() === currentUserId.toString()) {
      // Current user already sent the request
      return {
        type: "REQUEST_ALREADY_SENT",
        connection,
      };
    } else {
      // Current user received the request
      return {
      type: "INCOMING_REQUEST",
      connection,
    };
    }
  }

  if (connection.status === "connected") {
    return {
      type: "ALREADY_CONNECTED",
      connection,
    };
  }
  if (connection.status === "rejected") {
    connection.status = "pending";
    connection.requestedBy = currentUserId;

    await connection.save();
     return {
      type: "REQUEST_SENT",
      connection,
    };
  }
}

export async function cancelConnectionRequest(currentUserId, targetUserId) {
  const [userA, userB] = [currentUserId, targetUserId].sort();

  const connection = await ConnectionModel.findOne({ userA, userB, status: "pending", requestedBy: currentUserId });

  if (!connection) {
    throw new Error("No connection request found");
  }

  await connection.deleteOne();
  return connection;
}

export async function acceptCurrentConnectionRequest(currentUserId, targetUserId) {
  const [userA, userB] = [currentUserId, targetUserId].sort();

  if(currentUserId.toString() === targetUserId.toString()) {
    throw new Error("Something wrong");
  }

  const connection = await ConnectionModel.findOne({ userA, userB, status: "pending", requestedBy: targetUserId });

  if(!connection) {
    throw new Error("No connection request found");
  }

  connection.status = "connected";
  await connection.save();
  return connection;
}