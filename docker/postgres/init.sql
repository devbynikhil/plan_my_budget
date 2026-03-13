-- PostgreSQL initialization script for Docker

-- Create database if it doesn't exist
SELECT 'CREATE DATABASE expense_tracker'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'expense_tracker')\gexec

-- Connect to the database
\c expense_tracker;

-- Create extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Create indexes for better performance
-- These will be created by Drizzle migrations, but we can prepare the database

-- Set timezone
SET timezone = 'UTC';

-- Create a health check function
CREATE OR REPLACE FUNCTION health_check()
RETURNS TEXT AS $$
BEGIN
    RETURN 'OK';
END;
$$ LANGUAGE plpgsql;