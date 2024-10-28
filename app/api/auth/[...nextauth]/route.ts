import NextAuth, { AuthOptions } from "next-auth";
import { authOptions } from "@/utils/authOptions";


import prisma from "@/app/libs/prismadb";
import bcrypt from "bcrypt";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";


const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };