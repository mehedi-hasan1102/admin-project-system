import { z, ZodError } from "zod";

/**
 * Environment variables validation schema
 */
const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  PORT: z
    .string()
    .transform((val) => parseInt(val, 10))
    .default(5000),
  MONGODB_URI: z.string().url("Invalid MongoDB URI"),
  JWT_SECRET: z.string().min(32, "JWT_SECRET must be at least 32 characters"),
  FRONTEND_URL: z.string().default("http://localhost:3000"),
});

type Environment = z.infer<typeof envSchema>;

let validatedEnv: Environment | null = null;

/**
 * Validate environment variables on startup
 */
export const validateEnvironment = (): Environment => {
  if (validatedEnv) {
    return validatedEnv;
  }

  try {
    validatedEnv = envSchema.parse(process.env);
    console.log("✅ Environment variables validated successfully");
    return validatedEnv;
  } catch (error) {
    if (error instanceof ZodError) {
      const errors = error.issues.map((e: any) => ({
        field: e.path.join("."),
        message: e.message,
      }));
      console.error("❌ Environment validation failed:", errors);
      throw new Error("Invalid environment configuration");
    }
    throw error;
  }
};

/**
 * Get validated environment variables
 */
export const getEnv = (): Environment => {
  if (!validatedEnv) {
    throw new Error("Environment not validated. Call validateEnvironment() first.");
  }
  return validatedEnv;
};
