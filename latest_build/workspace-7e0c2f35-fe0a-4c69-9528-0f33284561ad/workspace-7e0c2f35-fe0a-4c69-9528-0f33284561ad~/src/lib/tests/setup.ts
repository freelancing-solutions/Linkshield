import { beforeEach } from 'vitest'
import { mockReset } from 'vitest-mock-extended'
import { prismaMock } from './prisma'

beforeEach(() => {
  mockReset(prismaMock)
})
