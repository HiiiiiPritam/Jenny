import NextAuth, { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import dbConnect from "./libs/dbConnect";
import User from "./models/User";

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.AUTH_GOOGLE_ID || "",
      clientSecret: process.env.AUTH_GOOGLE_SECRET || "",
    }),
  ],
  debug: true,
  callbacks: {
    async signIn({ user }) {
      await dbConnect(); // Ensure MongoDB is connected

      try {
        let existingUser = await User.findOne({ email: user.email });

        if (!existingUser) {
          existingUser = await User.create({
            name: user.name,
            email: user.email,
            image: user.image,
          });
        }

        user.id = existingUser._id.toString();
      } catch (error) {
        console.error("Error saving user to database:", error);
        return false; // Deny sign-in on error
      }

      return true;
    },

    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  secret: process.env.AUTH_SECRET,
};

// Export NextAuth instance for API route
export const authHandler = NextAuth(authOptions);
