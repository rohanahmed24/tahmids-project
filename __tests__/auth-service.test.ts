
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { authorizeUser } from '@/lib/auth-service';
import { pool } from '@/lib/db';
import bcrypt from 'bcryptjs';

// Mock dependencies
vi.mock('@/lib/db', () => ({
  pool: {
    query: vi.fn(),
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
    (pool.query as any).mockResolvedValue([[]]); // empty rows

    const result = await authorizeUser({ email: 'test@example.com', password: 'password' });
    expect(result).toBeNull();
    expect(pool.query).toHaveBeenCalledWith("SELECT * FROM users WHERE email = ?", ['test@example.com']);
  });

  it('returns null if password invalid', async () => {
    const mockUser = {
        id: 1,
        name: 'Test User',
        email: 'test@example.com',
        password_hash: 'hashed_password',
        role: 'user'
    };
    (pool.query as any).mockResolvedValue([[mockUser]]);
    (bcrypt.compare as any).mockResolvedValue(false);

    const result = await authorizeUser({ email: 'test@example.com', password: 'wrongpassword' });
    expect(result).toBeNull();
  });

  it('returns user object if password is valid', async () => {
    const mockUser = {
        id: 1,
        name: 'Test User',
        email: 'test@example.com',
        password_hash: 'hashed_password',
        role: 'user',
        image: 'http://example.com/avatar.jpg'
    };
    (pool.query as any).mockResolvedValue([[mockUser]]);
    (bcrypt.compare as any).mockResolvedValue(true);

    const result = await authorizeUser({ email: 'test@example.com', password: 'password' });

    expect(result).toEqual({
        id: "1",
        name: 'Test User',
        email: 'test@example.com',
        image: 'http://example.com/avatar.jpg',
        role: 'user'
    });
  });

    it('returns user object if password is valid (no image)', async () => {
    const mockUser = {
        id: 1,
        name: 'Test User',
        email: 'test@example.com',
        password_hash: 'hashed_password',
        role: 'user',
        image: null
    };
    (pool.query as any).mockResolvedValue([[mockUser]]);
    (bcrypt.compare as any).mockResolvedValue(true);

    const result = await authorizeUser({ email: 'test@example.com', password: 'password' });

    expect(result).toEqual({
        id: "1",
        name: 'Test User',
        email: 'test@example.com',
        image: null,
        role: 'user'
    });
  });

  it('handles database errors gracefully', async () => {
      (pool.query as any).mockRejectedValue(new Error('DB Error'));

      const result = await authorizeUser({ email: 'test@example.com', password: 'password' });
      expect(result).toBeNull();
  });
});
