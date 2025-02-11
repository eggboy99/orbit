import { ValidateRegistrationInput } from "../../middleware/ValidateRegistrationInput.mjs"
import { jest } from '@jest/globals'

describe("Registration Input Validation", () => {
    let req, res, next;
    beforeEach(() => {
        req = {
            body: {}
        };

        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        next = jest.fn();
    })

    it("should return 400 status code for invalid input", async () => {
        req.body = {
            email: "shayne.weiliang@gmail.com",
            password: "123",
            confirmPassword: "123",
            username: "shayne",
            mobileNumber: "82183334",
            image: "",
        }

        await ValidateRegistrationInput(req, res, next);
        expect(res.status).toHaveBeenCalledWith(400);
    })

    // should return password and image validation error
    it("should return the corresponding error message for the invalid input", async () => {
        req.body = {
            email: "shayne.weiliang@gmail.com",
            password: "123",
            confirmPassword: "123",
            username: "shayne",
            mobileNumber: "82183334",
            image: "",
        }

        await ValidateRegistrationInput(req, res, next);

        // gets the first call made to the mock res.json function and retrieve the first argumnet
        const jsonResponse = res.json.mock.calls[0][0];
        expect(jsonResponse).toEqual(
            expect.objectContaining({
                errors: expect.arrayContaining([
                    expect.objectContaining({
                        field: 'password',
                        message: 'Password must be between 8 and 16 characters'
                    }),
                    expect.objectContaining({
                        field: 'image',
                        message: 'Profile image is required'
                    }),
                    expect.objectContaining({
                        field: 'image',
                        message: 'Invalid image format.'
                    })
                ])
            })
        );
    })

})