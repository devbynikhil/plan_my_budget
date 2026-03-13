describe('Simple Test', () => {
  it('should pass basic test', () => {
    expect(1 + 1).toBe(2)
  })

  it('should have environment variables mocked', () => {
    expect(process.env.DATABASE_URL).toBeDefined()
    expect(process.env.OPENAI_API_KEY).toBeDefined()
  })
})