import { describe, it, expect, vi, beforeEach } from 'vitest'
import { prismaMock } from '@/lib/tests/prisma'
import { User } from '@prisma/client'
import { NextAuthOptions } from 'next-auth'

// Mock the db module specifically for this test file
vi.mock('@/lib/db', () => ({
  __esModule: true,
  db: prismaMock,
}))

describe('Authentication - Authorization Logic', () => {
  let authOptions: NextAuthOptions;

  beforeEach(async () => {
    // Dynamically import authOptions to ensure mock is applied first
    const authModule = await import('@/lib/auth');
    authOptions = authModule.authOptions;
  });

  it('Test Case 1.2.1: should successfully authorize a user with a valid email', async () => {
    // Arrange
    const credentialsProvider = authOptions.providers[0]
    const mockUser: User = {
      id: '1',
      email: 'test@example.com',
      name: 'Test User',
      plan: 'free',
      checks_used_this_month: 0,
      ai_analyses_used_this_month: 0,
      plan_expires_at: null,
      stripe_customer_id: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    const credentials = { email: 'test@example.com', password: 'anypassword' }
    prismaMock.user.findUnique.mockResolvedValue(mockUser)

    // Act
    // @ts-ignore - authorize is defined
    const result = await credentialsProvider.authorize(credentials)

    // Assert
    expect(prismaMock.user.findUnique).toHaveBeenCalledWith({ where: { email: credentials.email } })
    expect(result).toEqual({ id: mockUser.id, email: mockUser.email, name: mockUser.name, plan: mockUser.plan })
  })

  it('Test Case 1.2.2: should return null for a user that does not exist', async () => {
    // Arrange
    const credentialsProvider = authOptions.providers[0]
    const credentials = { email: 'nouser@example.com', password: 'anypassword' }
    prismaMock.user.findUnique.mockResolvedValue(null)

    // Act
    // @ts-ignore - authorize is defined
    const result = await credentialsProvider.authorize(credentials)

    // Assert
    expect(prismaMock.user.findUnique).toHaveBeenCalledWith({ where: { email: credentials.email } })
    expect(result).toBeNull()
  })

  it('should return null if email or password are not provided', async () => {
    // Arrange
    const credentialsProvider = authOptions.providers[0]
    const credentials1 = { email: 'test@example.com', password: '' }
    const credentials2 = { email: '', password: 'anypassword' }

    // Act
    // @ts-ignore - authorize is defined
    const result1 = await credentialsProvider.authorize(credentials1)
    // @ts-ignore
    const result2 = await credentialsProvider.authorize(credentials2)

    // Assert
    expect(result1).toBeNull()
    expect(result2).toBeNull()
    expect(prismaMock.user.findUnique).not.toHaveBeenCalled()
  })
})
