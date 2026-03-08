import { PrismaClient } from "@prisma/client";
import { createProxyClient } from "./db-proxy";

// Use the PHP proxy instead of a direct Prisma connection.
// The proxy sends SQL over HTTP to a PHP file deployed on
// the same server as the MySQL database (Namecheap).
export const db = createProxyClient() as unknown as PrismaClient;
