import { beforeEach } from "vitest";
import CountryCodeSelector from "../../src/components/CountryCodeSelector";
import userEvent from "@testing-library/user-event";

describe("Country Code Selector Component", () => {
  const mockSetCountryCode = vi.fn();
  const renderCountryCodeSelector = () => {
    render(
      <CountryCodeSelector
        countryCode="+65"
        setCountryCode={mockSetCountryCode}
      />
    );
  };

  beforeEach(() => {
    mockSetCountryCode.mockReset();
  });

  it("should not display the country codes menu when first rendered", () => {
    renderCountryCodeSelector();
    const countryCodesMenu = screen.queryByTestId("countryCodes");
    expect(countryCodesMenu).not.toBeVisible();
  });

  it("should display the country codes selection when the country code input is clicked", async () => {
    renderCountryCodeSelector();
    const countryCodeInput = screen.getByTestId("countryCodeInput");
    await userEvent.click(countryCodeInput);

    const countryCodesMenu = screen.queryByTestId("countryCodes");
    expect(countryCodesMenu).toBeVisible();
  });

  it("should pass the country code to setCountryCode when selecting", async () => {
    renderCountryCodeSelector();
    const countryCodeInput = screen.getByTestId("countryCodeInput");
    await userEvent.click(countryCodeInput);

    const dropdown = screen.getByTestId("countryCodes");
    expect(dropdown).toHaveClass("_countryCodesContainer_44f0d6 _open_44f0d6");

    const countryCodeOptions = screen.getAllByTestId("countryCode");
    const selectedCode = countryCodeOptions[0].textContent;
    await userEvent.click(countryCodeOptions[0]);

    expect(mockSetCountryCode).toHaveBeenCalledWith(selectedCode);
  });

  it("should close the dropdown after selection", async () => {
    renderCountryCodeSelector();
    const countryCodeInput = screen.getByTestId("countryCodeInput");
    await userEvent.click(countryCodeInput);

    const dropdown = screen.getByTestId("countryCodes");
    expect(dropdown).toHaveClass("_countryCodesContainer_44f0d6 _open_44f0d6");

    const countryCodeOptions = screen.getAllByTestId("countryCode");
    await userEvent.click(countryCodeOptions[0]);

    expect(dropdown).not.toHaveClass("open");
  });
});
