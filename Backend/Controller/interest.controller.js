import {
  createInterest,
  listInterests,
  selectInterests,
  getUserInterests,
  getUsersForInterest,
} from '../Services/interest.service.js';

export async function createInterestController(req, res) {
  try {
    const interest = await createInterest(req.body);
    return res.status(201).json(interest);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
}

export async function listInterestsController(req, res) {
  try {
    const interests = await listInterests();
    return res.status(200).json(interests);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
}

export async function selectInterestsController(req, res) {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { interestIds } = req.body;
    console.log('Received interestIds:', interestIds); // Debugging line
    console.log('user id', req.user.id); // Debugging line  
    const interests = await selectInterests(req.user.id, interestIds);
    return res.status(200).json(interests);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
}

export async function getUserInterestsController(req, res) {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const interests = await getUserInterests(req.user.id);
    return res.status(200).json(interests);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
}

export async function getUsersForInterestController(req, res) {
  try {
    const { interestId } = req.params;
    const users = await getUsersForInterest(interestId);
    return res.status(200).json(users);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
}
