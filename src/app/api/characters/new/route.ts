import { NextResponse } from "next/server";
import dbConnect from "@/libs/dbConnect";
import Character from "@/models/Character";

export async function POST(req: Request) {
  await dbConnect();
  
  try {
    const data = await req.json();

    if (!data.name) {
      return NextResponse.json({ error: "Character name is required" }, { status: 400 });
    }

    const newCharacter = await Character.create(data);
    return NextResponse.json(newCharacter);
  } catch (error) {
    console.error("Error creating character:", error);
    return NextResponse.json({ error: "Error creating character" }, { status: 500 });
  }
}
