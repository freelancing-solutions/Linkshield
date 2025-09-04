import { mockDeep, DeepMockProxy } from 'vitest-mock-extended'
import { PrismaClient } from '@prisma/client'

export type MockPrismaClient = DeepMockProxy<PrismaClient>

export const prismaMock = mockDeep<PrismaClient>() as MockPrismaClient