import { z } from 'zod';

/**
 * Zod schema for validating environment variables
 * This ensures all required environment variables are present and properly formatted
 */
export const envSchema = z.object({
  // Supabase configuration
  SUPABASE_URL: z.string()
    .url()
    .includes('supabase.co', { message: 'Must be a valid Supabase URL' }),
  
  SUPABASE_SERVICE_KEY: z.string()
    .min(20, { message: 'Service key is too short' })
    .refine(val => val.split('.').length === 3, { 
      message: 'Must be a valid JWT token format (xxx.yyy.zzz)' 
    }),
  
  SUPABASE_ANON_KEY: z.string()
    .min(20, { message: 'Anon key is too short' })
    .refine(val => val.split('.').length === 3, { 
      message: 'Must be a valid JWT token format (xxx.yyy.zzz)' 
    }),
  
  // Optional Redis configuration
  UPSTASH_REDIS_URL: z.string().url().optional(),
  
  // Node environment
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
});

/**
 * Type definition for validated environment
 */
export type Env = z.infer<typeof envSchema>;

/**
 * Validates environment variables against the schema
 * Throws detailed error messages if validation fails
 */
export function validateEnv(): Env {
  try {
    return envSchema.parse(process.env);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const issues = error.issues.map(issue => {
        return `- ${issue.path.join('.')}: ${issue.message}`;
      }).join('\n');
      
      console.error('❌ Environment validation failed:');
      console.error(issues);
      throw new Error(`Environment validation failed:\n${issues}`);
    }
    throw error;
  }
}

/**
 * Validates environment variables and returns a formatted report
 * Useful for health checks and diagnostics
 */
export function getEnvValidationReport(): { 
  valid: boolean; 
  issues: string[]; 
  env: Partial<Env> 
} {
  try {
    const validatedEnv = envSchema.parse(process.env);
    return {
      valid: true,
      issues: [],
      env: {
        ...validatedEnv,
        // Mask sensitive values
        SUPABASE_SERVICE_KEY: validatedEnv.SUPABASE_SERVICE_KEY.slice(0, 10) + '...',
        SUPABASE_ANON_KEY: validatedEnv.SUPABASE_ANON_KEY.slice(0, 10) + '...',
      }
    };
  } catch (error) {
    const issues: string[] = [];
    if (error instanceof z.ZodError) {
      error.issues.forEach(issue => {
        issues.push(`${issue.path.join('.')}: ${issue.message}`);
      });
    } else {
      issues.push('Unknown validation error');
    }
    
    return {
      valid: false,
      issues,
      env: {
        NODE_ENV: (process.env.NODE_ENV || 'development') as 'development' | 'production' | 'test',
        SUPABASE_URL: process.env.SUPABASE_URL,
      }
    };
  }
}
