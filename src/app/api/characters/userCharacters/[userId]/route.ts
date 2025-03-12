///api/characters/userCharacters/[userId]
import { NextResponse } from "next/server";
import dbConnect from "@/libs/dbConnect";
import Character from "@/models/Character";

export async function GET(req: Request, { params }: { params: { userId: string } }) {
  await dbConnect();

  try {
    const { userId } = params; // Extract userId from the route parameters

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    // Fetch all characters created by the given user
    const userCharacters = await Character.find({ createdBy: userId });

    return NextResponse.json(userCharacters);
  } catch (error) {
    console.error("Error fetching user's characters:", error);
    return NextResponse.json({ error: "Error fetching characters" }, { status: 500 });
  }
}
