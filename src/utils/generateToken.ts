// src/utils/generateToken.ts
import jwt from "jsonwebtoken";

const generateToken = (id: string, role: string) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET as string, {
    expiresIn: "30d", // Token will expire in 30 days
  });
};

export default generateToken;
