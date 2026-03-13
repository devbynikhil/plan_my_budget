import { NextResponse } from 'next/server';
import { db } from '@/utils/dbConfig';

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Check if we're in build time - if so, return early
    if (process.env.NODE_ENV === 'production' && !process.env.DATABASE_URL && !process.env.NEXT_PUBLIC_DATABASE_URL) {
      return NextResponse.json({ 
        status: 'build-time',
        message: 'Health check not available during static generation',
        timestamp: new Date().toISOString(),
      }, { status: 503 });
    }

    // Check database connection
    let dbCheck;
    try {
      dbCheck = db ? await db.execute('SELECT 1 as health') : null;
    } catch (dbError) {
      console.warn('Database health check failed:', dbError.message);
      dbCheck = null;
    }
    
    // Check environment variables
    const requiredEnvVars = [
      'DATABASE_URL',
      'NEXTAUTH_SECRET',
    ];
    
    const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);
    
    const healthStatus = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      checks: {
        database: dbCheck ? 'healthy' : 'unhealthy',
        environment: missingEnvVars.length === 0 ? 'healthy' : 'unhealthy',
      },
      uptime: process.uptime(),
      memory: {
        used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
        total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
      },
    };
    
    // If any check fails, return unhealthy status
    const isHealthy = Object.values(healthStatus.checks).every(check => check === 'healthy');
    
    if (!isHealthy) {
      healthStatus.status = 'unhealthy';
      healthStatus.issues = {
        missingEnvVars: missingEnvVars.length > 0 ? missingEnvVars : undefined,
      };
    }
    
    return NextResponse.json(healthStatus, {
      status: isHealthy ? 200 : 503,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });
    
  } catch (error) {
    console.error('Health check failed:', error);
    
    return NextResponse.json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: error.message,
      checks: {
        database: 'unhealthy',
        environment: 'unknown',
      },
    }, {
      status: 503,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });
  }
}