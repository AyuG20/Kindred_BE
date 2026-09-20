import UserModel from "../models/UserModel/User.js";
import ConnectionModel from "../models/ConnectionModel/connection.js";

export async function discoverUsers(userId, interestId) {
  const currentUser = await UserModel.findById(userId).populate({
    path: "interests",
    select: "name category",
  });

  //Finding all connection status for the current user to filter out already connected users
  const connections = await ConnectionModel.find({
    $or: [{ userA: userId }, { userB: userId }],
  });
 
  const connectionMap = new Map();
  connections.forEach((connection) => {
    const otherUserId =
      connection.userA.toString() === userId.toString()
        ? connection.userB.toString()
        : connection.userA.toString();
    connectionMap.set(otherUserId, {
      status: connection.status,
      requestedBy: connection.requestedBy.toString(),
    });
  });

  console.log(`Connection Map for user ${userId}:`, connectionMap);

  // Get the IDs of users who are already connected with the current user
  const connectedUserIds = Array.from(connectionMap.entries())
  .filter(([, connection]) => connection.status === "connected")
  .map(([userId]) => userId);

  console.log(`Connected User IDs for user ${userId}:`, connectedUserIds);

  const currentUserInterestIds = currentUser.interests.map(
    (interest) => interest._id,
  );
  if (!userId) {
    throw new Error("Invalid User Id");
  }
  if (!currentUser) {
    throw new Error("Not able to fetch User's interest");
  }

  const query = {
    _id: { $nin: [userId, ...connectedUserIds] },
    interests: { $in: currentUserInterestIds },
  };

  // optional interest filter
  if (interestId) {
    query.interests = interestId;
  }

  const listOfSharedInterestUsers = await UserModel.find(query)
    .select("firstName lastName bio location profilePicture interests")
    .populate({ path: "interests", select: "name category" });

  const discoverUsers = listOfSharedInterestUsers.map((user) => {
    const sharedInterests = user.interests.filter((interest) => {
      return currentUserInterestIds.some((id) => {
        return String(id) === String(interest._id);
      });
    });
    const connection = connectionMap.get(String(user._id));

    return {
      ...user.toObject(),
      sharedInterests,
      matchCount: sharedInterests.length,
      connectionStatus: connection?.status ?? null,
      requestedBy: connection?.requestedBy ?? null,
    };
  });

  discoverUsers.sort((a, b) => b.matchCount - a.matchCount);

  return {
    success: true,
    message: "Discover users fetched successfully",
    currentUserInterests: currentUser.interests,
    users: discoverUsers,
  };
}
