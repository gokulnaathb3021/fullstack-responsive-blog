import { NextResponse } from "next/server";
import { connect } from "@/app/utils/db";
import prisma from "@/prisma";

export const GET = async (req: Request, res: NextResponse) => {
  try {
    const id = req.url.split("blog/")[1];
    await connect();
    const post = await prisma.post.findFirst({ where: { id } });
    if (!post)
      return NextResponse.json({ message: "NOT FOUND" }, { status: 404 });
    return NextResponse.json({ message: "OK", post }, { status: 200 });
  } catch (e) {
    return NextResponse.json({ message: "ERROR" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
};
export const PUT = async (req: Request, res: NextResponse) => {
  try {
    const id = req.url.split("blog/")[1];
    const { title, description } = await req.json();
    await connect();
    const post = await prisma.post.update({
      data: { title, description },
      where: { id },
    });
    return NextResponse.json({ message: "OK", post }, { status: 200 });
  } catch (e) {
    return NextResponse.json({ message: "ERROR", e }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
};
export const DELETE = async (req: Request, res: NextResponse) => {
  try {
    const id = req.url.split("blog/")[1];
    await connect();
    const post = await prisma.post.delete({ where: { id } });
    return NextResponse.json({ message: "OK", post }, { status: 200 });
  } catch (e) {
    return NextResponse.json({ message: "ERROR", e }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
};
