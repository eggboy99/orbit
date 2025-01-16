import { render } from "@testing-library/react";
import ImageUploadForm from "../../src/components/ImageUploadForm";
import userEvent from "@testing-library/user-event";

describe("Image Upload Form", () => {
  const mockSetImage = vi.fn();
  const mockRegister = vi.fn();

  const renderImageUpload = () => {
    return render(
      <ImageUploadForm
        setImage={mockSetImage}
        id="profileImage"
        register={mockRegister}
      />
    );
  };

  // Reset all mocks before each test case
  beforeEach(() => {
    mockSetImage.mockReset();
    mockRegister.mockReset();
  });

  it("should render the file input with correct attributes", () => {
    renderImageUpload();
    const fileInput = screen.getByTestId("imageInput");

    // Check if the input has the correct properties
    expect(fileInput).toHaveAttribute("type", "file");
    expect(fileInput).toHaveAttribute("accept", ".png, .jpg, .jpeg");
    expect(fileInput).toHaveAttribute("id", "profileImage");
  });

  it("should call register with correct parameters", () => {
    renderImageUpload();
    expect(mockRegister).toHaveBeenCalledWith("image", {
      required: "Profile Image is required",
    });
  });

  it("should handle image upload correctly", async () => {
    renderImageUpload();

    // Create a mock file
    const file = new File(["profileImage"], "profileImage.png", {
      type: "image/png",
    });

    // Mocking the file reader with a funciton that always return the same pre-defined result
    const mockFileReader = {
      readAsDataURL: vi.fn(),
      result: "data:image/png;base64,testdata",
      onloadend: null,
    };

    globalThis.FileReader = vi.fn(() => mockFileReader);

    const fileInput = screen.getByTestId("imageInput");
    await userEvent.upload(fileInput, file);
    mockFileReader.onloadend();

    expect(mockSetImage).toHaveBeenCalledWith(mockFileReader.result);
  });
});
