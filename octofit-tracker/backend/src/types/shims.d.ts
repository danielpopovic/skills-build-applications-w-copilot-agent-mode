declare module "cors";
declare module "dotenv";
declare module "mongoose";

declare module "express" {
  export interface Request {
    [key: string]: unknown;
  }

  export interface Response {
    status(code: number): Response;
    json(body: unknown): void;
  }

  interface ExpressApp {
    use: (...args: unknown[]) => void;
    get: (path: string, handler: (req: Request, res: Response) => void | Promise<void>) => void;
    listen: (port: number, callback?: () => void) => void;
  }

  interface ExpressFactory {
    (): ExpressApp;
    json: () => unknown;
  }

  const express: ExpressFactory;
  export default express;
}

declare const process: {
  env: Record<string, string | undefined>;
  exit(code?: number): never;
};
