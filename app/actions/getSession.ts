import { authOptions } from "@/utils/authOptions";
import { getServerSession } from "next-auth";
// import { authOptions } from "../api/auth/[...nextauth]/route";

export default async function getSession() {
  return await getServerSession(authOptions);
}