import { ObjectId } from "mongodb";
import mongoose from "mongoose";
import { RegisterUser } from "../../controllers/RegisterUser.mjs";
import { jest } from '@jest/globals'

jest.mock('mongoose', () => {
    return {
        connection: {
            once: jest.fn((event, callback) => {
                if (event === 'open') {
                    callback();
                }
            }),
            db: { collection: jest.fn().mockReturnValue({}) }
        }
    };
});


jest.mock('mongodb', () => ({
    GridFSBucket: jest.fn(() => ({
        openUploadStream: jest.fn().mockReturnValue({}),
    }))
}))

jest.mock('stream', () => ({
    Readable: jest.fn(() => ({
        push: jest.fn(),
        pipe: jest.fn().mockReturnValue({
            on: jest.fn((event, callback) => {
                if (event === 'finish') {
                    callback();
                }
                return this;
            })
        })
    }))
}));

describe('Profile Image Upload', () => {
    it("should handle image upload and save it to the database", async () => {
        // let mockRequest = {
        //     body: {
        //         email: "testuser@gmail.com",
        //         password: "Password?123",
        //         username: 'testuser',
        //         mobileNumber: "+6582183334",
        //         image: 'data:image/png;base64,abc123',
        //     }

        // }

        // let mockResponse = {
        //     status: jest.fn().mockReturnThis(),
        //     json: jest.fn()
        // };

        // const base64Image = mockRequest.body.image;
        // const username = mockRequest.body.username;

        // const imageBuffer = Buffer.from(base64Image.replace(/^data:image\/\w+;base64,/, ''), 'base64');

        // jest.spyOn(Date, 'now').mockImplementation(() => new Date('2025-01-01'));
        // const imageName = `profile-${Date.now()} - ${username}`;

        // await RegisterUser(mockRequest, mockResponse);
    })
})
