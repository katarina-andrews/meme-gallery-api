export interface Meme {
    id?: number;
    title: string;
    url: string;
    userId?: number;
}

export interface User {
  id?: number;
  username: string;
  password: string; // hashed
  role?: "regular" | "admin";
}

export interface Like {
  id?: number;
  userId: number;
  memeId: number;
}

declare global{
    namespace Express {
        interface Request {
            user?: {
                userId: string;
            };
        }
    }
}

