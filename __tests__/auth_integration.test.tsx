
import { vi, describe, it, expect, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import RegisterPage from "@/app/register/page";
import SignInPage from "@/app/signin/page";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

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
    ...actual,
    motion: {
      div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
      button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
      p: ({ children, ...props }: any) => <p {...props}>{children}</p>,
    },
    AnimatePresence: ({ children }: any) => <>{children}</>,
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
