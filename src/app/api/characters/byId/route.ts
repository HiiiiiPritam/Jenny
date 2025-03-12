import dbConnect from "@/libs/dbConnect";
import Character from "@/models/Character";
import { NextRequest, NextResponse } from "next/server";


export async function GET(req: Request) {
  await dbConnect();
  
  try {
    const { searchParams } = new URL(req.url);
    const characterId = searchParams.get("id");

    if (!characterId) return NextResponse.json({ error: "Character ID is required" }, { status: 400 });

    const character = await Character.findById(characterId);
    if (!character) return NextResponse.json({ error: "Character not found" }, { status: 404 });

    return NextResponse.json(character);
  } catch (error) {
    console.error("Error fetching character:", error);
    return NextResponse.json({ error: "Error fetching character" }, { status: 500 });
  }
}