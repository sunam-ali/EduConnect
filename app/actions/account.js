"use server";

import { User } from "@/model/user-model";
import { validatePassword } from "@/queries/users";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";

export async function updateUserInfo(email, updatedData) {
  try {
    const filter = { email: email };
    await User.findOneAndUpdate(filter, updatedData);
    revalidatePath("/account");
  } catch (error) {
    throw new Error(error);
  }
}

export async function updateProfilePicture(email, base64Image) {
  try {
    const filter = { email: email };
    const dataToUpdate = { profilePicture: base64Image };

    await User.findOneAndUpdate(filter, dataToUpdate);
    revalidatePath("/account");

    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}


export async function changePassword(email, oldPassword, newPassword) {
  try {
    const isMatch = await validatePassword(email, oldPassword);

    if (!isMatch) {
      return {
        success: false,
        error: "Please enter a valid current password.",
      };
    }

    // Recommended: Use a standard round factor of 10 or 12 for better security
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await User.findOneAndUpdate({ email: email }, { password: hashedPassword });

    revalidatePath("/account");
    return { success: true };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      error: "Something went wrong while updating the password.",
    };
  }
}
