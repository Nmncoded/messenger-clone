import prisma from "@/app/libs/prismadb";
import bcrypt from "bcrypt";
import {NextResponse} from 'next/server';

export const POST = async (request: Request) => {
  try {
    const body = await request.json();
    const { name, email, password } = body;
  
    if (!name || !email || !password) {
      return new NextResponse("Missing info", { status: 400 });
    }
    const hashedPassword = await bcrypt.hash(password, 12);
  
    const user = await prisma.user.create({
      data: {
        email,
        name,
        hashedPassword,
      },
    });
  
    return NextResponse.json(user);
  } catch (error) {
    console.log("REGISTRATION_ERROR",error);
    return new NextResponse("Internal Error", { status: 500 });
  }
};