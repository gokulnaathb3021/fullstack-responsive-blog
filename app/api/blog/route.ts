import { NextResponse } from "next/server";
import { connect } from "@/app/utils/db";
import prisma from "@/prisma";

export const GET = async (req: Request, res: NextResponse) => {
  try {
    await connect();
    const posts = await prisma.post.findMany();
    return NextResponse.json({ message: "OK", posts }, { status: 200 });
  } catch (e) {
    return NextResponse.json({ message: "ERROR", e }, { status: 500 });
  } finally {
    // disconnecting database and our application
    await prisma.$disconnect();
  }
};

export const POST = async (req: Request, res: NextResponse) => {
  try {
    const { title, description, imageUrl } = await req.json();
    await connect();
    const post = await prisma.post.create({
      data: { title, description, imageUrl },
    });
    return NextResponse.json({ message: "OK", post }, { status: 200 });
  } catch (e) {
    return NextResponse.json({ message: "ERROR", e }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
};
