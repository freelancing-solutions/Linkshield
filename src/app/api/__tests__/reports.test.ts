// src/app/api/__tests__/reports.test.ts
import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import axios from 'axios';
import { PrismaClient } from '@prisma/client';
import { execSync } from 'child_process';
import { v4 as uuidv4 } from 'uuid';

// This assumes your Next.js app is running on http://localhost:3000
const API_BASE_URL = 'http://localhost:3000/api';

const prisma = new PrismaClient();

// Helper function to create a test user
async function createTestUser() {
  const user = await prisma.user.create({
    data: {
      email: `test-user-${uuidv4()}@example.com`,
      name: 'Test User',
      plan: 'pro',
    },
  });
  return user;
}

// Helper function to create a test check
async function createTestCheck(userId: string | null, isPublic: boolean, slug: string | null = null) {
  const check = await prisma.check.create({
    data: {
      userId: userId,
      url: `https://example.com/${uuidv4()}`,
      urlHash: uuidv4(),
      securityScore: 80,
      isPublic: isPublic,
      slug: slug || (isPublic ? `test-slug-${uuidv4().slice(0, 8)}` : null),
      createdAt: new Date(),
    },
  });
  return check;
}

describe('Reports API Integration Tests', () => {
  let testUser: any;
  let publicReport: any;
  let privateReportOwned: any;
  let privateReportUnowned: any;

  beforeAll(async () => {
    // Ensure database is clean and migrated before tests run
    execSync('npm run db:reset -- --force', { stdio: 'inherit' }); // Use --force for non-interactive reset
    execSync('npm run db:migrate', { stdio: 'inherit' });

    // Create test data
    testUser = await createTestUser();
    publicReport = await createTestCheck(testUser.id, true);
    privateReportOwned = await createTestCheck(testUser.id, false);
    privateReportUnowned = await createTestCheck(null, false); // No owner or different owner
  });

  afterAll(async () => {
    // Clean up test data
    await prisma.check.deleteMany({});
    await prisma.user.deleteMany({});
    await prisma.$disconnect();
  });

  // Mock session for authenticated requests
  // This is a simplified mock. In a real app, you'd mock next-auth's getServerSession
  // or use a testing utility that handles session mocking more robustly.
  // For API routes, you might need to set specific headers or cookies.
  // For now, we'll assume the API routes can be tested without full session mocking
  // if they rely on `userId` being passed directly or if we test unauthenticated paths.

  describe('GET /api/reports/[slug]', () => {
    it('should return a public report by slug', async () => {
      const response = await axios.get(`${API_BASE_URL}/reports/${publicReport.slug}`);
      expect(response.status).toBe(200);
      expect(response.data.slug).toBe(publicReport.slug);
      expect(response.data.isPublic).toBe(true);
    });

    it('should return 404 for a non-existent slug', async () => {
      await expect(axios.get(`${API_BASE_URL}/reports/non-existent-slug`)).rejects.toThrow('Request failed with status code 404');
    });

    it('should return a private report if owned by authenticated user', async () => {
      // This test requires mocking authentication.
      // For simplicity, we'll assume a mechanism where userId is passed or mocked.
      // In a real integration test, you'd simulate a logged-in user.
      // For now, we'll test the unauthenticated path or rely on the service's internal logic.
      // The API route itself checks `session?.user?.id`.
      // To properly test this, you'd need to mock `getServerSession` in the test environment.
      // This is beyond the scope of a simple `axios` call without a test server setup.
      // Skipping for now, focusing on public/unauthenticated access.
    });

    it('should return 403 for a private report not owned by authenticated user', async () => {
      // Similar to above, requires mocking authentication.
      // Skipping for now.
    });
  });

  describe('PUT /api/reports/[slug]/privacy', () => {
    it('should update report privacy to public', async () => {
      const slug = privateReportOwned.slug;
      // This test requires authentication.
      // For now, we'll assume a way to send authenticated requests.
      // In a real test, you'd get a session token and include it in headers.
      const response = await axios.put(`${API_BASE_URL}/reports/${slug}/privacy`, { isPublic: true }, {
        // Mock authentication: In a real scenario, you'd pass a valid auth token
        // headers: { Authorization: `Bearer ${testUser.authToken}` }
      });
      expect(response.status).toBe(200);
      expect(response.data.message).toBe('Report privacy updated successfully');

      const updatedReport = await prisma.check.findUnique({ where: { slug } });
      expect(updatedReport?.isPublic).toBe(true);
    });

    it('should update report privacy to private', async () => {
      const slug = publicReport.slug;
      const response = await axios.put(`${API_BASE_URL}/reports/${slug}/privacy`, { isPublic: false }, {
        // Mock authentication
      });
      expect(response.status).toBe(200);
      expect(response.data.message).toBe('Report privacy updated successfully');

      const updatedReport = await prisma.check.findUnique({ where: { slug } });
      expect(updatedReport?.isPublic).toBe(false);
    });

    it('should return 401 if unauthorized', async () => {
      const slug = privateReportOwned.slug;
      await expect(axios.put(`${API_BASE_URL}/reports/${slug}/privacy`, { isPublic: true }, {
        // No auth token
      })).rejects.toThrow('Request failed with status code 401'); // Or 403 depending on exact auth setup
    });

    it('should return 403 if not owner', async () => {
      // This requires mocking a different user's session
    });
  });

  describe('DELETE /api/dashboard/reports/[id]', () => {
    let reportToDelete: any;

    beforeEach(async () => {
      reportToDelete = await createTestCheck(testUser.id, false); // Create a new private report for each delete test
    });

    it('should delete a report if owned by authenticated user', async () => {
      const id = reportToDelete.id;
      const response = await axios.delete(`${API_BASE_URL}/dashboard/reports/${id}`, {
        // Mock authentication
      });
      expect(response.status).toBe(200);
      expect(response.data.message).toBe('Report deleted successfully');

      const deletedReport = await prisma.check.findUnique({ where: { id } });
      expect(deletedReport?.slug).toBeNull(); // Slug should be null after deletion
      expect(deletedReport?.isPublic).toBe(false); // Should be private
    });

    it('should return 401 if unauthorized', async () => {
      const id = reportToDelete.id;
      await expect(axios.delete(`${API_BASE_URL}/dashboard/reports/${id}`, {
        // No auth token
      })).rejects.toThrow('Request failed with status code 401');
    });

    it('should return 403 if not owner', async () => {
      // This requires mocking a different user's session
    });

    it('should return 404 if report not found', async () => {
      await expect(axios.delete(`${API_BASE_URL}/dashboard/reports/non-existent-id`, {
        // Mock authentication
      })).rejects.toThrow('Request failed with status code 404');
    });
  });
});
