import mongoose from "mongoose";
import { GridFSBucket } from 'mongodb';
import { Readable } from 'stream';

const connection = mongoose.connection;
let gfs;

connection.once('open', () => {
    gfs = new GridFSBucket(connection.db, {
        bucketName: "images" // Creating a special database for images
    });
});

const uploadImage = async (imageName, imageBuffer, metadata = {}) => {
    try {
        // Creates a writable stream that we can use to write our image data into GridFS
        const uploadStream = gfs.openUploadStream(imageName, {
            metadata: {
                ...metadata,
                uploadDate: new Date()
            }
        });

        // Create a readable stream for us to read the data and connect it with uploadStream (writable)
        const bufferStream = new Readable();
        bufferStream.push(imageBuffer);
        bufferStream.push(null); // Signals wer are done sending the data

        // When everything is safely stored, we return the storage location or the error
        return new Promise((resolve, reject) => {
            bufferStream.pipe(uploadStream) // Connects the bufferStream(readable) to the uploadStream(writable)
                .on('finish', () => resolve(uploadStream.id))
                .on('error', reject);
        });
    } catch (error) {
        throw new Error(`Failed to upload image: ${error.message}`);
    }
};

export { gfs, uploadImage };