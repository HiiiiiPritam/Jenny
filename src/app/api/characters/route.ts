import { NextResponse } from "next/server";
import dbConnect from "@/libs/dbConnect";
import Character from "@/models/Character";

export async function GET(req: Request) {
  await dbConnect();

  try {
    const { searchParams } = new URL(req.url);
    const createdBy = searchParams.get("createdBy"); // Get user ID filter
    const isPublic = searchParams.get("isPublic"); // Filter by public/private

    let query: any = {};
    if (createdBy) query.createdBy = createdBy;
    if (isPublic !== null) query.isPublic = isPublic === "true";

    const characters = await Character.find(query);
    return NextResponse.json(characters);
  } catch (error) {
    console.error("Error fetching characters:", error);
    return NextResponse.json({ error: "Error fetching characters" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  await dbConnect();
  
  try {
    const { id, ...updates } = await req.json();

    if (!id) return NextResponse.json({ error: "Character ID is required" }, { status: 400 });

    const updatedCharacter = await Character.findByIdAndUpdate(id, updates, { new: true });

    if (!updatedCharacter) return NextResponse.json({ error: "Character not found" }, { status: 404 });

    return NextResponse.json(updatedCharacter);
  } catch (error) {
    console.error("Error updating character:", error);
    return NextResponse.json({ error: "Error updating character" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  await dbConnect();
  
  try {
    const { id } = await req.json();

    if (!id) return NextResponse.json({ error: "Character ID is required" }, { status: 400 });

    await Character.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting character:", error);
    return NextResponse.json({ error: "Error deleting character" }, { status: 500 });
  }
}
