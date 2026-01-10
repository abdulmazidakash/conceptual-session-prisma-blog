import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import { admin, twoFactor } from "better-auth/plugins"
import { Resend } from 'resend';
import { adminRole, userRole } from "./permissions";


const resend = new Resend('re_c6eyhBzf_6KxFKaCsdKsaopMYkiiFZx4c');

export const auth = betterAuth({
    appName: "lab log",
    baseURL: process.env.BETTER_AUTH_URL,
    basePath: "/api/v1/auth",

    database: prismaAdapter(prisma, {
        provider: "postgresql"
    }),
    trustedOrigins: [process.env.FRONTEND_URL!],
    rateLimit: {
        enabled: true,
        window: 10,
        max: 1,

        customRules: {
            "/ok": {
                max: 1,
                window: 60,
            }
        },

        storage: "memory"
    },
    advanced: {
        cookiePrefix: "lablog"
    },
    emailAndPassword: {
        enabled: true,
        minPasswordLength: 6,
    },
    socialProviders: {
        github: {
            clientId: process.env.GITHUB_CLIENT_ID as string,
            clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
            redirectURI: `${process.env.FRONTEND_URL}/api/auth/callback/github`,
        },
    },
    plugins: [
        admin({
            adminRoles: ["admin", "user"],
            defaultRole: "user",
            roles: {
                admin: adminRole,
                user: userRole,
            }
        }),
        twoFactor({
            otpOptions: {
                period: 2,
                async sendOTP({ user, otp }, ctx) {
                    console.log({ user, otp })
                    await resend.emails.send({
                        from: 'Lablog <onboarding@resend.dev>',
                        to: user.email,
                        subject: 'Two factor Authentication',
                        html: `<p>Your otp is <b>${otp}</b></p>`,
                    });
                }
            },
            // skipVerificationOnEnable: true 
        })
    ]
});

