import { User } from "@/model/user-model";
import { dbConnect } from "@/service/mongo";

import { NextResponse } from "next/server";

import bcrypt from "bcryptjs";

export const POST = async (request) => {
  try {
    const { firstName, lastName, email, password, userRole } =
      await request.json();

    await dbConnect();

    // 1. Validation: Check if the user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return NextResponse.json(
        { message: "An account with this email already exists." },
        { status: 400 },
      );
    }

    // 2. Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = {
      firstName,
      lastName,
      email: email.toLowerCase(), // Store in lowercase for consistency
      password: hashedPassword,
      role: userRole,
    };

    // 3. Save to database
    await User.create(newUser);

    // FIX: Return a JSON object instead of raw text
    return NextResponse.json(
      { message: "User has been created successfully." },
      { status: 201 },
    );
  } catch (error) {
    console.error("Registration error:", error);

    // FIX: Return errors as JSON objects too
    return NextResponse.json(
      { message: error.message || "Internal Server Error" },
      { status: 500 },
    );
  }
};
