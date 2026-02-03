import { Request, Response } from "express";
import { registerUser, loginUser } from "./auth.service";

export const register = async (req: Request, res: Response) => {
    const { name, email, password, role } = req.body;

    const result = await registerUser(name, email, password, role);

    res.status(201).json({
        message: "User registered successfully",
        data: result
    });
}

export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const result = await loginUser(email, password);

    res.status(200).json({
        message: "User logged in successfully",
        data: result
    });
}