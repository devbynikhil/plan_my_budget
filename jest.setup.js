import '@testing-library/jest-dom'

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
  })),
  useSearchParams: jest.fn(() => new URLSearchParams()),
  usePathname: jest.fn(() => '/'),
}))

// Mock Clerk
jest.mock('@clerk/nextjs', () => ({
  useUser: () => ({
    user: {
      id: 'test-user-id',
      emailAddresses: [{ emailAddress: 'test@example.com' }],
      firstName: 'Test',
      lastName: 'User',
    },
    isLoaded: true,
  }),
  useAuth: () => ({
    userId: 'test-user-id',
    isLoaded: true,
    isSignedIn: true,
  }),
  ClerkProvider: ({ children }) => children,
  SignInButton: ({ children }) => children,
  SignOutButton: ({ children }) => children,
  UserButton: () => <div>User Button</div>,
}))

// Mock environment variables
process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test'
process.env.OPENAI_API_KEY = 'test-openai-key'
process.env.EMAIL_USER = 'test@example.com'
process.env.EMAIL_PASS = 'test-password'
process.env.ADMIN_EMAILS = 'admin@example.com'

// Add TextDecoder polyfill for Node.js environment
global.TextDecoder = global.TextDecoder || require('util').TextDecoder
global.TextEncoder = global.TextEncoder || require('util').TextEncoder

// Mock fetch globally
global.fetch = jest.fn()

// Mock Request and Response for API route testing
global.Request = class Request {
  constructor(url, options = {}) {
    this.url = url
    this.method = options.method || 'GET'
    this.headers = new Headers(options.headers)
    this._body = options.body
  }
  
  async json() {
    return JSON.parse(this._body || '{}')
  }
}

global.Response = class Response {
  constructor(body, options = {}) {
    this.body = body
    this.status = options.status || 200
    this.headers = new Headers(options.headers)
    this.ok = this.status >= 200 && this.status < 300
  }
  
  async json() {
    return JSON.parse(this.body || '{}')
  }
  
  static json(data, options = {}) {
    return new Response(JSON.stringify(data), {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      }
    })
  }
}

// Clean up after each test
afterEach(() => {
  jest.clearAllMocks()
})