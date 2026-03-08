import bcrypt from "bcrypt";
import prisma from "../../lib/prisma";

type RegisterUserInput = {
    email: string;
    name?: string;
    password: string;
};

export class AuthService {
    async registerUser({ email, name, password }: RegisterUserInput) {
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            throw new Error("User already exists");
        }

        const passwordHash = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                email,
                name,
                passwordHash,
            },
            select: {
                id: true,
                email: true,
                name: true,
                createdAt: true,
            },
        });

        return user;
    }

    async loginUser(email: string, password: string) {
        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            throw new Error("Invalid email or password");
        }

        const passwordMatches = await bcrypt.compare(password, user.passwordHash);

        if (!passwordMatches) {
            throw new Error("Invalid email or password");
        }

            return {
                id: user.id,
                email: user.email,
                name: user.name,
                createdAt: user.createdAt,
            };
        }
    }