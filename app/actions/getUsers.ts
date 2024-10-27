import  prisma  from "@/app/libs/prismadb";
import getSession  from "./getSession";

const getUsers = async () => {
  const session = await getSession();
  if( !session?.user?.email ) {
    return [];
  }
  try {
    const users = await prisma.user.findMany({
      where: {
        NOT: {
          email: session.user.email
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
    return users;
  } catch (error) {
    return [];
  }
} 

export default getUsers