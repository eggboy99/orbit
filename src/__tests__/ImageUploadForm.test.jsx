import { render } from "@testing-library/react";
import ImageUploadForm from "../../src/components/ImageUploadForm";
import userEvent from "@testing-library/user-event";
import { useForm } from "react-hook-form";

// Mocking the react-hook-form module
vi.mock("react-hook-form", () => ({
  // Creating a mock version of the useForm hook
  useForm: () => ({
    register: vi.fn((name) => ({
      name,
      onChange: vi.fn(),
      onBlur: vi.fn(),
      ref: vi.fn(),
    })),
    handleSubmit: vi.fn((cb) => cb),
    formState: {
      errors: {},
    },
    getValues: vi.fn(),
    setValue: vi.fn(),
  }),
}));

describe("Image Upload Form", () => {
  const mockSetImage = vi.fn();
  const mockSetFileError = vi.fn();
  const { register } = useForm();

  const renderImageUpload = () => {
    return render(
      <ImageUploadForm
        setImage={mockSetImage}
        id="profileImage"
        register={register}
        setFileError={mockSetFileError}
      />
    );
  };

  // Reset all mocks before each test case
  beforeEach(() => {
    vi.clearAllMocks();
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
    expect(register).toHaveBeenCalledWith("image", {
      required: "Profile image is required",
      validate: expect.any(Function),
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
