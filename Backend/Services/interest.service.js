import UserModel from '../models/UserModel/User.js';
import InterestModel from '../models/InterestModel/Interest.js';
import { Types } from 'mongoose';

export async function createInterest(payload) {
  const { name, category } = payload;
  const existing = await InterestModel.findOne({ name });
  if (existing) {
    throw new Error('Interest already exists');
  }

  const interest = await InterestModel.create({ name, category });
  return interest;
}

export async function listInterests() {
  return InterestModel
    .find()
    .select("name category emoji")
    .sort({ category: 1, name: 1 });
}

export async function getUserInterests(userId) {
  const user = await UserModel.findById(userId).populate({ path: 'interests', select: '_id name category' });
  if (!user) {
    throw new Error('User not found');
  }

  return user.interests;
}

export async function selectInterests(userId, interestIds) {

  const user = await UserModel.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }

  if(!Array.isArray(interestIds) || interestIds.length < 3) {
    throw new Error('Please select at least 3 interests');
  }

  // const interests = await InterestModel.find({ _id: { $in: interestIds } });
  // if (interests.length !== new Set(interestIds).size) {
  //   throw new Error('One or more interests are invalid');
  // }

  const uniqueInterestIds = Array.from(new Set(interestIds)).map((id) => new Types.ObjectId(id));

  user.interests = uniqueInterestIds;
  user.onboardingStatus = "COMPLETED";
  await user.save();

  // await InterestModel.updateMany(
  //   { _id: { $in: uniqueInterestIds } },
  //   { $addToSet: { users: user._id } }
  // );

  // await InterestModel.updateMany(
  //   { _id: { $nin: uniqueInterestIds } },
  //   { $pull: { users: user._id } }
  // );

  return await getUserInterests(userId);
}

// export async function selectInterests(interestIds) {
//   if (!Array.isArray(interestIds) || interestIds.length < 3) {
//     throw new Error("Please select at least 3 interests");
//   }

//   return {
//     success: true,
//     message: "Interests selected successfully",
//     onboardingStatus: "PROFILE",
//     interests: interestIds,
//   };
// }

export async function getUsersForInterest(interestId) {
  const interest = await InterestModel.findById(interestId).populate({ path: 'users', select: 'firstName lastName email' });
  if (!interest) {
    throw new Error('Interest not found');
  }

  return interest.users;
}
