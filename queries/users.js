import { replaceMongoIdInObject } from "@/lib/convertData";
import { User } from "@/model/user-model";

import bcrypt from "bcryptjs";

export async function getUserByEmail(email) {
  const user = await User.findOne({ email: email }).select("-password").lean();
  return replaceMongoIdInObject(user);
}

export async function getUserDetails(userId) {
  const user = await User.findById(userId).select("-password").lean();
  return replaceMongoIdInObject(user);
}

export async function validatePassword(email, password) {
  const user = await User.findOne({ email: email }).lean();
  if (!user || !user.password) return false;

  const isMatch = await bcrypt.compare(password, user.password);
  return isMatch;
}
