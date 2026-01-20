
/* eslint-disable @typescript-eslint/no-explicit-any */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { authorizeUser } from '@/lib/auth-service';
import { prisma } from '@/lib/db';
import bcrypt from 'bcryptjs';

vi.mock('@/lib/db', () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
    },
  },
}));

vi.mock('bcryptjs', () => ({
  default: {
    compare: vi.fn(),
  },
  compare: vi.fn(),
}));

describe('authorizeUser', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns null if email or password is missing', async () => {
    expect(await authorizeUser({})).toBeNull();
    expect(await authorizeUser({ email: 'test@example.com' })).toBeNull();
    expect(await authorizeUser({ password: 'password' })).toBeNull();
  });

  it('returns null if user not found', async () => {
    (prisma.user.findUnique as any).mockResolvedValue(null);

    const result = await authorizeUser({ email: 'test@example.com', password: 'password' });
    expect(result).toBeNull();
    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: { email: 'test@example.com' }
    });
  });

  it('returns null if password invalid', async () => {
    const mockUser = {
      id: 1,
      name: 'Test User',
      email: 'test@example.com',
      password: 'hashed_password',
      role: 'USER',
      image: null
    };
    (prisma.user.findUnique as any).mockResolvedValue(mockUser);
    (bcrypt.compare as any).mockResolvedValue(false);

    const result = await authorizeUser({ email: 'test@example.com', password: 'wrongpassword' });
    expect(result).toBeNull();
  });

  it('returns user object if password is valid', async () => {
    const mockUser = {
      id: 1,
      name: 'Test User',
      email: 'test@example.com',
      password: 'hashed_password',
      role: 'USER',
      image: 'http://example.com/avatar.jpg'
    };
    (prisma.user.findUnique as any).mockResolvedValue(mockUser);
    (bcrypt.compare as any).mockResolvedValue(true);

    const result = await authorizeUser({ email: 'test@example.com', password: 'password' });

    expect(result).toEqual({
      id: "1",
      name: 'Test User',
      email: 'test@example.com',
      image: 'http://example.com/avatar.jpg',
      role: 'USER'
    });
  });

  it('returns user object if password is valid (no image)', async () => {
    const mockUser = {
      id: 1,
      name: 'Test User',
      email: 'test@example.com',
      password: 'hashed_password',
      role: 'USER',
      image: null
    };
    (prisma.user.findUnique as any).mockResolvedValue(mockUser);
    (bcrypt.compare as any).mockResolvedValue(true);

    const result = await authorizeUser({ email: 'test@example.com', password: 'password' });

    expect(result).toEqual({
      id: "1",
      name: 'Test User',
      email: 'test@example.com',
      image: null,
      role: 'USER'
    });
  });

  it('handles database errors gracefully', async () => {
    (prisma.user.findUnique as any).mockRejectedValue(new Error('DB Error'));

    const result = await authorizeUser({ email: 'test@example.com', password: 'password' });
    expect(result).toBeNull();
  });
});
