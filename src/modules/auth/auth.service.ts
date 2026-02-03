import bcrypt from "bcrypt";
import User from "../users/user.model";
import { signToken } from "../../utils/jwt";

export const registerUser = async (
    name: string,
    email: string,
    password: string,
    role: "creator" | "eventee"
) => {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw new Error("User already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
        name,
        email,
        password: hashedPassword,
        role
    })

    const token = signToken({ id: user._id, role: user.role})

    return { user, token };
}

export const loginUser = async (email: string, password: string) => {
    const user = await User.findOne({ email });
    if (!user) throw new Error('Invalid credentials');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error('Invalid credentials');

    const token = signToken({ id: user._id, role: user.role });

    return { user, token };
}