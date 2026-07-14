"use server";

import { signIn } from "@/auth";
import { AuthError } from "next-auth";

export async function credentialLogin(formData) {
  try {
    // NextAuth v5 throws an error directly out of signIn if it fails
    await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirect: false, // Prevents automatic routing, allowing custom redirects
    });

    return {
      success: true,
      error: null,
    };
  } catch (error) {
    if (error instanceof AuthError) {
      // Handle NextAuth specific errors thrown during authorization
      const errorType = error.cause?.err?.message || error.type;

      if (
        errorType === "CredentialsSignin" ||
        errorType.includes("User not found") ||
        errorType.includes("Check your password")
      ) {
        return {
          success: false,
          error: "Invalid email or password.",
        };
      }

      return {
        success: false,
        error: "Authentication failed.",
      };
    }

    // Fallback for general server/database errors
    return {
      success: false,
      error: "Something went wrong. Please try again.",
    };
  }
}
export async function doSocialLogin(formData) {
  const action = formData.get("action");
  await signIn(action, { redirectTo: "/courses" });
}
