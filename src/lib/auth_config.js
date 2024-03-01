import GoogleProvider from "next-auth/providers/google";
import { read, create } from "@/service/mongoDB/mongoose_user";

let uid;

const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_PWD,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      try {
        uid = account.provider + user.id;
        const findResult = await read({ uid });

        if (!findResult) {
          await create({ uid, nick: user.name, email: user.email });
        }

        return true;
      } catch (err) {
        console.error(err.message);
        return false;
      }
    },
    async redirect({ url, baseUrl }) {
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
    async session({ session, user, token }) {
      session.user.uid = uid;
      return session;
    },
    async jwt({ token, user, account }) {
      return token;
    },
  },
};

export default authOptions;
