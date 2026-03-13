// Jest environment setup
// Set up environment variables for testing

process.env.NEXT_PUBLIC_DATABASE_URL = 'postgresql://test:test@localhost:5432/test'
process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test'
process.env.AI_PROVIDER = 'mock'
process.env.OPENAI_API_KEY = 'test-openai-key'
process.env.GROQ_API_KEY = 'test-groq-key'
process.env.SMTP_HOST = 'smtp.test.com'
process.env.SMTP_PORT = '587'
process.env.SMTP_USER = 'test@test.com'
process.env.SMTP_PASS = 'testpass'
process.env.SMTP_FROM = 'test@test.com'
process.env.EMAIL_USER = 'test@test.com'
process.env.EMAIL_PASS = 'testpass'
process.env.ADMIN_EMAILS = 'admin@test.com'
process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY = 'pk_test_test'
process.env.CLERK_SECRET_KEY = 'sk_test_test'

// Force AI provider to mock for tests
process.env.NODE_ENV = 'test'