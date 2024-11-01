import getCurrentUser from "@/app/actions/getCurrentUser";
import prisma from "@/app/libs/prismadb";
import { pusherServer } from "@/app/libs/pusher";
import {NextResponse} from 'next/server';

export const POST = async (request: Request) => {
  try {
    const currentUser = await getCurrentUser();
    const body = await request.json();
    const { name, image } = body;
    
    if (!currentUser?.id || !currentUser?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
  
    const updatedUser = await prisma.user.update({
      where: {
        id: currentUser.id
      },
      data: {
        name,
        image
      },
    });

    // After updating user data
    await pusherServer.trigger('users-global', 'users:refresh', updatedUser);


    return NextResponse.json(updatedUser);


  
  } catch (error) {
    console.log("SETTINGS_ERROR",error);
    return new NextResponse("Internal Error", { status: 500 });
  }
};