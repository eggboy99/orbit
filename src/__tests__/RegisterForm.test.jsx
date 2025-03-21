import { expect } from "vitest";
import googleIcon from "../../src/assets/images/google.png";
import RegisterForm from "../../src/components/RegisterForm";
import userEvent from "@testing-library/user-event";
import OTPVerification from "../../src/pages/OTPVerification";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { waitFor } from "@testing-library/dom";

const mockNavigate = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe("Registration Form", () => {
  const registrationForm = [
    {
      name: "email",
      inputType: "text",
      placeholder: "Email",
      testValue: "testing@email.com",
    },
    {
      name: "password",
      inputType: "password",
      placeholder: "Password",
      testValue: "12345",
    },
    {
      name: "confirmPassword",
      inputType: "password",
      placeholder: "Confirm Password",
      testValue: "12345",
    },
    {
      name: "username",
      inputType: "text",
      placeholder: "Username",
      testValue: "shayne",
    },
    {
      name: "mobileNumber",
      inputType: "text",
      placeholder: "Mobile Number",
      testValue: "+6582183334",
    },
  ];

  const registerButtons = [
    { name: "Register", type: "submit" },
    { name: "Register with Google", type: "submit", icon: googleIcon },
  ];

  it("should display all the registration inputs to the user", () => {
    render(
      <MemoryRouter initialEntries={["/authentication"]}>
        <RegisterForm
          formInputs={registrationForm}
          buttons={registerButtons}
          testId="registrationForm"
          prefillData={null}
        />
      </MemoryRouter>
    );

    registrationForm.forEach((element) => {
      const input = screen.getByPlaceholderText(element.placeholder);
      expect(input).toBeInTheDocument();
    });
  });

  it("should allow users to update the input value correctly", async () => {
    render(
      <MemoryRouter initialEntries={["/authentication"]}>
        <RegisterForm
          formInputs={registrationForm}
          buttons={registerButtons}
          testId="registrationForm"
          prefillData={null}
        />
      </MemoryRouter>
    );
    for (const field of registrationForm) {
      const input = screen.getByPlaceholderText(field.placeholder);
      await userEvent.type(input, field.testValue);
      expect(input).toHaveValue(field.testValue);
    }
  });

  it("should validate the input values before submitting", async () => {
    render(
      <MemoryRouter initialEntries={["/authentication"]}>
        <RegisterForm
          formInputs={registrationForm}
          buttons={registerButtons}
          testId="registrationForm"
          prefillData={null}
        />
      </MemoryRouter>
    );

    for (const field of registrationForm) {
      const input = screen.getByPlaceholderText(field.placeholder);
      await userEvent.type(input, field.testValue);
    }

    // password input value is 12345 therefore we will get an error of "Password must be at least 8 characters"
    // as the password is less than 8 characters.
    const submitButton = screen.getByTestId("Register");
    await userEvent.click(submitButton);
    const passwordInputError = screen.getByText(
      "Password must be at least 8 characters"
    );
    expect(passwordInputError).toBeInTheDocument();
  });

  it("should be able to submit the form to the backend server", async () => {
    render(
      <MemoryRouter initialEntries={["/authentication"]}>
        <RegisterForm
          formInputs={registrationForm}
          buttons={registerButtons}
          testId="registrationForm"
          prefillData={null}
        />
      </MemoryRouter>
    );
    // Mock fetch API
    const fetchSpy = vi.spyOn(globalThis, "fetch").mockImplementation(() =>
      Promise.resolve({
        json: () => Promise.resolve({ success: true }),
      })
    );

    // Inserting input values that follow each input requirements to prevent validation error from occuring
    await userEvent.type(
      screen.getByPlaceholderText("Email"),
      "test@example.com"
    );
    await userEvent.type(
      screen.getByPlaceholderText("Password"),
      "Password?12345"
    );
    await userEvent.type(
      screen.getByPlaceholderText("Confirm Password"),
      "Password?12345"
    );
    await userEvent.type(screen.getByPlaceholderText("Username"), "testuser");
    await userEvent.type(
      screen.getByPlaceholderText("Mobile Number"),
      "82183334"
    );

    const imageInput = screen.getByLabelText("Upload your profile image");
    let mockImage = new File(["User Profile Image"], "userImage.png", {
      type: "image/png",
    });

    await userEvent.upload(imageInput, mockImage);
    const submitButton = screen.getByTestId("Register");
    await userEvent.click(submitButton);

    expect(fetchSpy).toHaveBeenCalledWith(
      "http://localhost:3000/api/register",
      expect.objectContaining({
        method: "POST",
        headers: { "Content-Type": "application/json" },
      })
    );

    // Retrieved the called body from mockCalls array and use the result for comparison
    const calledBody = JSON.parse(fetchSpy.mock.calls[0][1].body);
    expect(calledBody).toEqual(
      expect.objectContaining({
        email: "test@example.com",
        password: "Password?12345",
        confirmPassword: "Password?12345",
        username: "testuser",
        mobileNumber: "+6582183334",
      })
    );
    expect(calledBody.image).toMatch(/^data:image\/png;base64,/);
  });

  it("should direct user to the google authentication page when Register with Google button is clicked", async () => {
    const location = window.location; // Stores the original window.location object
    delete window.location; // Delete the existing window location object so that we can replace it with our test version
    window.location = { ...location, href: "" }; // Copies all the properties from the original window.location but we assign href to ""

    // watch the window.location object and monitor the href property. "set" is the operation the test will be monitoring
    const hrefSpy = vi.spyOn(window.location, "href", "set");

    render(
      <MemoryRouter initialEntries={["/authentication"]}>
        <Routes>
          <Route
            path="/authentication"
            element={
              <RegisterForm
                formInputs={registrationForm}
                buttons={registerButtons}
                testId="registrationForm"
                prefillData={null}
              />
            }
          ></Route>
        </Routes>
      </MemoryRouter>
    );

    const googleButton = screen.getByTestId("GoogleRegister");
    await userEvent.click(googleButton);

    expect(hrefSpy).toHaveBeenCalledWith(
      "http://localhost:3000/api/auth/google/"
    );

    // Restores window.location we created at the start (cleanup process)
    window.location = location;
  });

  it("should bring user to OTP verification page upon successful registration", async () => {
    window.fetch = vi.fn(() =>
      Promise.resolve({
        json: () =>
          Promise.resolve({
            success: true,
            redirectTo: "/authentication/verify/123",
          }),
      })
    );

    render(
      <MemoryRouter initialEntries={["/authentication"]}>
        <Routes>
          <Route
            path="/authentication"
            element={
              <RegisterForm
                formInputs={registrationForm}
                buttons={registerButtons}
                testId="registrationForm"
                prefillData={null}
              />
            }
          />
          <Route
            path="/authentication/verify/:id"
            element={<OTPVerification />}
          />
        </Routes>
      </MemoryRouter>
    );

    await userEvent.type(
      screen.getByPlaceholderText("Email"),
      "test@example.com"
    );
    await userEvent.type(
      screen.getByPlaceholderText("Password"),
      "Password?12345"
    );
    await userEvent.type(
      screen.getByPlaceholderText("Confirm Password"),
      "Password?12345"
    );
    await userEvent.type(screen.getByPlaceholderText("Username"), "testuser");
    await userEvent.type(
      screen.getByPlaceholderText("Mobile Number"),
      "82183334"
    );

    const imageInput = screen.getByLabelText("Upload your profile image");
    let mockImage = new File(["User Profile Image"], "userImage.png", {
      type: "image/png",
    });

    await userEvent.upload(imageInput, mockImage);
    const submitButton = screen.getByTestId("Register");
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/authentication/verify/123");
    });
  });
});
