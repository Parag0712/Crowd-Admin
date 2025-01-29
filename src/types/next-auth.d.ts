import "next-auth";
import { DefaultSession } from "next-auth";

export type UserRole = {
  MASTER;
  ADMIN;
  PRINCIPAL;
};

declare module "next-auth" {
  interface User {
    id: string;
    role: UserRole;
    name: string;
    email: string;
    phoneNumber: string;
    token: string;
  }

  interface Session {
    user: User & DefaultSession["user"];
  }
}

// Second way
declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: UserRole;
    name: string;
    email: string;
    phoneNumber: string;
    token: string;
  }
}
