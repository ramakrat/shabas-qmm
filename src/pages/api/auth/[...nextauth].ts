import NextAuth, { User } from "next-auth";
import type { NextApiRequest, NextApiResponse } from "next";
import CredentialsProvider from "next-auth/providers/credentials";

let userT = "";
let userData = {};

export default async function auth(req: NextApiRequest, res: NextApiResponse) {
    // Do whatever you want here, before the request is passed down to `NextAuth`

    // save user data only if not undefined, so it doesn't overwrite
    if (req.body.userType !== undefined) {
        userT = req.body.userType;
    }

    return await NextAuth(req, res, {
        // Configure one or more authentication providers
        providers: [
            CredentialsProvider({
                name: "Credentials",
                credentials: {
                    username: { label: "Email", type: "text", placeholder: "Email" },
                    password: { label: "Password", type: "password" },
                },
                async authorize(credentials, req) {
                    let userType = credentials?.userType.toString();

                    let tempUser = await FindUserByRoleAndEmail({
                        email: credentials?.email,
                        role: userType,
                    });

                    if (tempUser) {
                        let user = {
                            id: tempUser.id,
                            email: tempUser.email,
                            first_name: tempUser.first_name,
                            last_name: tempUser.last_name,
                            full_name: tempUser.full_name,
                            profile_image: tempUser.profile_image,
                            active: tempUser.active,
                            provider: tempUser.provider,
                            role: userType,
                        };

                        return user;
                    } else {
                        return null;
                    }
                },
            }),
            // ...add more providers here
        ],
        secret: process.env.JWT_SECRET,
        session: {
            strategy: "jwt",
            maxAge: 7 * 24 * 60 * 60,
        },
        pages: {
            signIn: "/",
            signOut: "/signout",
            error: "/authentication/login", // Error code passed in query string as ?error=
            verifyRequest: "/auth/verify-request", // (used for check email message)
        },
        callbacks: {
            async signIn({ user, account, profile, email, credentials }) {
                return true;
            },
            jwt({ token, user, account, profile, isNewUser }) {
                token.user = user;
            },
            session({ session, token, user }) {
                // Return a cookie value as part of the session

                // For google
                if (token?.profile != undefined) {
                    session.user = token.profile;
                }

                if (token.access_token) {
                    session.access_token = token.access_token;
                }

                // for credentials
                if (token.user !== undefined) {
                    session.user = token.user;
                }

                return session;
            },
        },
    });
}

// Function returns object from database if exists
// Otherwise returns null
async function FindUserByRoleAndEmail({
    email,
    role,
}: {
    email: string;
    role: "admin" | "lead_assessor" | "assessor";
}): Promise<ADMIN | LEAD_ASSESSOR | ASSESSOR> {
    let userData: ADMIN | LEAD_ASSESSOR | ASSESSOR;

    try {
        if (role === "admin") {
            userData = await GetAdminDataByCreds(email);
        } else if (role === "assessor") {
            userData = await GetAssessorByCreds(email);
        } else {
            userData = await GetLeadAssessorDataByCreds(email);
        }
    } catch (error) {
        console.log(error);
        return null;
    }

    return userData;
}

function CreateNewAdmin(newUser: ADMIN) {
    throw new Error("Function not implemented.");
}


function CreateNewAssesor(newAdmin: ASSESSOR) {
    throw new Error("Function not implemented.");
}

function CreateNewLeadAssessor(newAdmin: LEAD_ASSESSOR) {
    throw new Error("Function not implemented.");
}



function GetAdminDataByCreds(email: string): any {
    throw new Error("Function not implemented.");
}

function GetAssessorByCreds(email: string): any {
    throw new Error("Function not implemented.");
}


function GetLeadAssessorDataByCreds(email: string): any {
    throw new Error("Function not implemented.");
}
