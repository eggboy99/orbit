import Home from "../../src/pages/Home";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { MobileMenuContextProvider } from "../../src/context/MobileMenuContext";
import userEvent from "@testing-library/user-event";
import PathnameDisplay from "./utils/PathnameDisplay";
import { AuthenticationContextProvider } from "../../src/context/AuthenticationContext";
describe("Home Page", () => {
  it("should have consists of two sections: Slogan Container and Company Information Container", () => {
    render(
      <AuthenticationContextProvider>
        <MobileMenuContextProvider>
          <MemoryRouter>
            <Home />
          </MemoryRouter>
        </MobileMenuContextProvider>
      </AuthenticationContextProvider>
    );

    const containers = [
      screen.getByTestId("sloganContainer"),
      screen.getByTestId("companyGoalContainer"),
    ];
    containers.forEach((container) => expect(container).toBeInTheDocument());
  });
});

describe("Get Started Button", () => {
  it("should bring user the registration page", async () => {
    render(
      <AuthenticationContextProvider>
        <MobileMenuContextProvider>
          <MemoryRouter>
            <Home />
            <Routes>
              <Route path="/authentication" element={<PathnameDisplay />} />
            </Routes>
          </MemoryRouter>
        </MobileMenuContextProvider>
      </AuthenticationContextProvider>
    );
    const button = screen.getByRole("button", { name: /Get Started/i });

    expect(button).toBeInTheDocument();

    await userEvent.click(button);
    expect(screen.getByTestId("current-path")).toHaveTextContent(
      /authentication/i
    );
  });
});
