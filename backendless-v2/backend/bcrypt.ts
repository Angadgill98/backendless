import bcrypt from "bcrypt";

const saltRounds = 10;

export async function HashPassword(password: string) {
    const hash = await bcrypt.hash(password, saltRounds);
    return hash;
}