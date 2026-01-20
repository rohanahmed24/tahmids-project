
import { vi, describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import RegisterPage from "@/app/(public)/register/page";
import SignInPage from "@/app/(public)/signin/page";
import { signIn } from "next-auth/react";

// Mock next-auth/react
vi.mock("next-auth/react", () => ({
  signIn: vi.fn(),
  useSession: vi.fn(() => ({ data: null, status: "unauthenticated" })),
  SessionProvider: ({ children }: { children: React.ReactNode }) => children,
}));

// Mock next/navigation
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

// Mock framer-motion to avoid animation issues in tests
vi.mock("framer-motion", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...(actual as Record<string, unknown>),
    motion: {
      div: ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => <div {...props}>{children}</div>,
      button: ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => <button {...props}>{children}</button>,
      p: ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => <p {...props}>{children}</p>,
    },
    AnimatePresence: ({ children }: React.PropsWithChildren) => <>{children}</>,
  };
});

describe("Auth Pages Integration", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("calls signIn with 'google' when Google button is clicked on Register page", async () => {
    render(<RegisterPage />);
    const googleButton = screen.getByText("Google");
    fireEvent.click(googleButton);
    expect(signIn).toHaveBeenCalledWith("google", expect.objectContaining({ callbackUrl: "/" }));
  });

  it("calls signIn with 'github' when GitHub button is clicked on Register page", async () => {
    render(<RegisterPage />);
    const githubButton = screen.getByText("GitHub");
    fireEvent.click(githubButton);
    expect(signIn).toHaveBeenCalledWith("github", expect.objectContaining({ callbackUrl: "/" }));
  });

  it("calls signIn with 'google' when Google button is clicked on SignIn page", async () => {
    render(<SignInPage />);
    const googleButton = screen.getByText("Google");
    fireEvent.click(googleButton);
    expect(signIn).toHaveBeenCalledWith("google", expect.objectContaining({ callbackUrl: "/" }));
  });
});
