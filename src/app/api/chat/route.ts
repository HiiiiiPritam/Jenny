
import { NextResponse } from "next/server";
import dbConnect from "@/libs/dbConnect";
import Chats from "@/models/Chats";

export async function GET(req: Request) {

  const body = await req.json();
  const { userID } = body;
  await dbConnect();

  if (!userID) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const chats = await Chats.find({ user: userID }).populate("character");
    return NextResponse.json(chats, { status: 200 });
  } catch (error) {
    console.error("Error fetching chats:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
