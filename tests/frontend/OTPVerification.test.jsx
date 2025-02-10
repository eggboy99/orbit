import { Routes, Route, MemoryRouter } from "react-router-dom";
import OTPVerification from "../../src/pages/OTPVerification";
import { AuthenticationContextProvider } from "../../src/context/AuthenticationContext";
import { MobileMenuContextProvider } from "../../src/context/MobileMenuContext";
import { beforeEach } from "vitest";
import userEvent from "@testing-library/user-event";
import { waitFor } from "@testing-library/dom";
import { cleanup } from "@testing-library/react";
import { act } from "react";

const mockNavigate = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe("OTP Verification Page", () => {
  beforeEach(() => {
    render(
      <MemoryRouter initialEntries={["/authentication/verifiy/:id"]}>
        <MobileMenuContextProvider>
          <AuthenticationContextProvider>
            <Routes>
              <Route
                element={<OTPVerification />}
                path="/authentication/verifiy/:id"
              />
            </Routes>
          </AuthenticationContextProvider>
        </MobileMenuContextProvider>
      </MemoryRouter>
    );
  });

  it("should have display the necessary elements", () => {
    const elements = [
      { name: "OTPForm" },
      { name: "OTPInputs" },
      { name: "resendOTPBtn" },
      { name: "OTPSubmitBtn" },
    ];
    elements.forEach((element) => {
      element.testId = screen.getByTestId(element.name);
      expect(element.testId).toBeInTheDocument();
    });
  });

  it("should redirect user to the home page when the OTP input is verified successfully", async () => {
    window.fetch = vi.fn(() =>
      Promise.resolve({
        json: () =>
          Promise.resolve({
            success: true,
            message: "User Registration Completed Successfully",
            redirect: "/",
          }),
      })
    );

    const OTPSubmitBtn = screen.getByTestId("OTPSubmitBtn");
    await userEvent.click(OTPSubmitBtn);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/");
    });
  });

  it("should start countdown from 30 seconds and disable when reaching 0", async () => {
    cleanup();
    vi.useFakeTimers();

    window.fetch = vi.fn(() =>
      Promise.resolve({
        json: () =>
          Promise.resolve({
            success: true,
          }),
      })
    );

    render(
      <MemoryRouter initialEntries={["/authentication/verifiy/:id"]}>
        <MobileMenuContextProvider>
          <AuthenticationContextProvider>
            <Routes>
              <Route
                element={<OTPVerification />}
                path="/authentication/verifiy/:id"
              />
            </Routes>
          </AuthenticationContextProvider>
        </MobileMenuContextProvider>
      </MemoryRouter>
    );

    const resendOTPBtn = screen.getByTestId("resendOTPBtn");

    expect(resendOTPBtn).toBeDisabled();

    // If we don't use await act the test might try to check the button's state before these state changes
    // We increments 1second at a time to ensure that each interval callback executes properly
    for (let i = 0; i <= 30; i++) {
      await act(async () => {
        vi.advanceTimersByTime(1000);
      });
    }

    expect(resendOTPBtn).toBeEnabled();

    vi.useRealTimers();
  });
});
