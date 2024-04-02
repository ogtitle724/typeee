import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { read, create } from "./service/mongoDB/mongoose_user";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [GoogleProvider],
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      const isExist = await read({ uid: profile.sub });

      if (!isExist) {
        await create({
          uid: profile.sub,
          name: user.name,
          email: user.email,
          profile_img: user.image,
        });
      }

      return true;
    },
    async session({ session, user, token }) {
      if (token.id) {
        session.user.uid = token.id;
      }
      console.log("\n\nSESSION UPDATE **********************");
      console.log(session);
      return session;
    },
    async jwt({ token, user, account, profile, isNewUser }) {
      if (account && account.providerAccountId) {
        token.id = account.providerAccountId;
      }

      return token;
    },
  },
});
