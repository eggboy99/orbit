import { MemoryRouter } from "react-router-dom";
import Authentication from "../../src/pages/Authentication";
import userEvent from "@testing-library/user-event";
import { MobileMenuContextProvider } from "../../src/context/MobileMenuContext";
import { AuthenticationContextProvider } from "../../src/context/AuthenticationContext";

describe("Authentication Page", () => {
  it("should not dispay the toggle form checkbox input to the user", () => {
    render(
      <AuthenticationContextProvider>
        <MobileMenuContextProvider>
          <MemoryRouter>
            <Authentication />
          </MemoryRouter>
        </MobileMenuContextProvider>
      </AuthenticationContextProvider>
    );
    const formToggle = screen.getByTestId("formToggleButton");
    const inputElement = within(formToggle).queryByRole("checkbox");
    expect(inputElement).toBeNull(); // checkbox should not be displayed
  });

  it("should be able to toggle between sign in and registration form", async () => {
    render(
      <AuthenticationContextProvider>
        <MobileMenuContextProvider>
          <MemoryRouter>
            <Authentication />
          </MemoryRouter>
        </MobileMenuContextProvider>
      </AuthenticationContextProvider>
    );
    const formToggle = screen.getByTestId("formToggleButton");

    // Toggle the registration form component
    await userEvent.click(formToggle);
    const registerForm = screen.getByTestId("registrationForm");
    expect(registerForm).toBeInTheDocument();

    // Toggle the login form component
    await userEvent.click(formToggle);
    const loginForm = screen.getByTestId("loginForm");
    expect(loginForm).toBeInTheDocument();
  });
});
