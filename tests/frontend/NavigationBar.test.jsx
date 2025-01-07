import NavigationBar from "../../src/components/NavigationBar";
import { MemoryRouter, Route, Routes, useLocation } from "react-router-dom";
import App from "../../src/App";
import userEvent from "@testing-library/user-event";

const navigationOptions = [
  { name: "Explore", path: "/explore", testId: "explore-navigator" },
  { name: "Community", path: "/community", testId: "community-navigator" },
  { name: "orbit", path: "/", testId: "home-navigator" },
  { name: "Social Feed", path: "/news-feed", testId: "newsfeed-navigator" },
  { name: "Articles", path: "/articles", testId: "articles-navigator" },
  { name: "Login", path: "/login", testId: "login-navigator" },
];

// Helper component to display the current pathname
const PathnameDisplay = () => {
  const location = useLocation();
  return <div data-testid="current-path">{location.pathname}</div>;
};

describe("Navigation Bar", () => {
  it("should render 6 navigation options: Explore, Community, Brand, Social Feed, Articles and a Login button", () => {
    render(
      <MemoryRouter>
        <NavigationBar />
      </MemoryRouter>
    );

    navigationOptions.forEach((option) => {
      expect(
        screen.getByText(new RegExp(option.name, "i"))
      ).toBeInTheDocument();

      const link = screen.getByTestId(option.testId);
      expect(link).toHaveAttribute("href", option.path); // checks if each navigation option element has the appropriate href value
    });
    const button = screen.getByRole("button", { name: /Login/i });
    expect(button).toBeInTheDocument();
  });

  it("navigates to the correct page when a navigation option is clicked", async () => {
    render(
      <MemoryRouter>
        <App />
        <Routes>
          {navigationOptions.map((option) => (
            <Route
              key={option.path}
              path={option.path}
              element={<PathnameDisplay />}
            />
          ))}
        </Routes>
      </MemoryRouter>
    );

    // Simulate navigation and check the pathname
    for (const option of navigationOptions) {
      const link = screen.getByTestId(option.testId);
      await userEvent.click(link);
      expect(screen.getByTestId("current-path")).toHaveTextContent(option.path);
    }
  });

  it("should display side menu when the hamburger menu icon is clicked", async () => {
    render(
      <MemoryRouter>
        <NavigationBar />
      </MemoryRouter>
    );

    const hamburgerMenu = screen.getByTestId("hamburger-menu");
    await userEvent.click(hamburgerMenu);

    const brandContainer = screen.getByText(/orbit/i);
    // expect(brandContainer).toHaveClass("active"); // class received "active_39763a" due to CSS module local scope
    expect(brandContainer.className).toMatch(/active/); // therefore we use regular expression to check if the classname contains subtring active

    // Click again to close the menu and check if the active class still exists
    await userEvent.click(hamburgerMenu);
    expect(brandContainer).not.toHaveClass("active");
  });

  it("should have the navigation options highlighted when user hovered over them", async () => {
    render(
      <MemoryRouter>
        <NavigationBar />
      </MemoryRouter>
    );

    navigationOptions.forEach(async (option) => {
      const element = screen.getByTestId(option.testId);
      await userEvent.hover(element);
      expect(element).toHaveStyle("color: #3c4451");
    });
  });
});
