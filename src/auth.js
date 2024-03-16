import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { read, create } from "./service/mongoDB/mongoose_user";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [GoogleProvider],
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      const isExist = await read({ email: user.email });

      if (!isExist) {
        await create({
          name: user.name,
          email: user.email,
          profile_img: user.image,
        });
      }

      return true;
    },
    async redirect({ url, baseUrl }) {
      return baseUrl;
    },
    async session({ session, user, token }) {
      return session;
    },
    async jwt({ token, user, account, profile, isNewUser }) {
      return token;
    },
  },
});
