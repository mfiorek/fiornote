import { DrizzleAdapter } from "@auth/drizzle-adapter";
import {
  getServerSession,
  type DefaultSession,
  type NextAuthOptions,
} from "next-auth";
import { type SendVerificationRequestParams } from "next-auth/providers";
import GitHubProvider from "next-auth/providers/github";
import { Resend } from "resend";
import { env } from "~/env.mjs";
import { db } from "~/server/db";
import { mysqlTable } from "~/server/db/schema";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      // ...other properties
      // role: UserRole;
    } & DefaultSession["user"];
  }

  // interface User {
  //   // ...other properties
  //   // role: UserRole;
  // }
}

export const resend = new Resend(env.RESEND_API_KEY);

const sendVerificationRequest = async (
  params: SendVerificationRequestParams,
) => {
  try {
    await resend.emails.send({
      from: "fiornote@fiorek.codes",
      to: params.identifier,
      subject: "fiornote - Login Magic Link",
      html: `Please click here to authenticate and log in: ${params.url}`,
    });
  } catch (error) {
    console.error({ error });
  }
};

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
  pages: {
    signIn: "/login",
    // verifyRequest: "/checkyouremail",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    jwt: ({ token, user }) => {
      if (user) {
        return {
          ...token,
          id: user.id,
        };
      }
      return token;
    },
    session: ({ session, token }) => {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id,
        },
      };
    },
  },
  adapter: DrizzleAdapter(db, mysqlTable),
  providers: [
    GitHubProvider({
      clientId: env.GITHUB_ID,
      clientSecret: env.GITHUB_SECRET,
    }),
    {
      id: "email",
      type: "email",
      from: "fiornote@fiorek.codes",
      server: {},
      maxAge: 24 * 60 * 60,
      name: "Email",
      options: {},
      sendVerificationRequest,
    },
  ],
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = () => getServerSession(authOptions);
