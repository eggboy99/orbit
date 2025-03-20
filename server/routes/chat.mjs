import { Router } from "express";
import Messages from "../models/Messages.mjs";
import { uploadImage } from "../config/gridfs-setup.mjs";
import { gfs } from "../config/gridfs-setup.mjs";
import mongoose from "mongoose";

const chatRouter = Router();

chatRouter.get("/chat/messages/:productId/:recipientId/:senderId", async (req, res, next) => {
    try {
        const { productId, recipientId, senderId } = req.params;
        const messages = await Messages.find({
            productId: new mongoose.Types.ObjectId(productId),
            recipientId: new mongoose.Types.ObjectId(recipientId),
            senderId: new mongoose.Types.ObjectId(senderId),
        }).sort({ createdAt: 1 });

        let latestMessage = await Messages.findOne({
            senderId: senderId,
            recipientId: recipientId, productId: productId
        }).sort({ createdAt: -1 });

        if (latestMessage.message) {
            latestMessage = latestMessage.message;
        }


        res.json({ success: true, messages, latestMessage })
    } catch (error) {
        console.error("Error retrieving chat messages: ", error);
    }
})


chatRouter.post('/chat/uploadImage/:senderId/:productId/:recipientId', async (req, res, next) => {
    const images = req.body;
    const { productId, recipientId, senderId } = req.params;
    const messageImages = await Promise.all(
        images.map(async (image, index) => {
            const imageBuffer = Buffer.from(
                image.replace(/^data:image\/\w+;base64,/, ''),
                'base64'
            );

            let imageName = `${senderId}-${productId}-${recipientId}`;
            return await uploadImage(imageName, imageBuffer, {
                type: 'message',
                sender: senderId,
                recipient: recipientId,
            });
        })
    );


    await Messages.create({
        senderId: senderId,
        recipientId: recipientId,
        productId: productId,
        images: messageImages,
    });

    return res.status(200).json({ success: true, message: 'Image uploaded successfully.' });

})

chatRouter.get('/chat/images/retrieve/:messageId/:imageId', async (req, res, next) => {
    try {
        const { imageId } = req.params;
        const image = new mongoose.Types.ObjectId(imageId);
        const downloadStream = gfs.openDownloadStream(image);
        downloadStream.pipe(res).on('error', (error) => {
            console.log('Image not found: ', error);
        })
    } catch (error) {
        console.log(error);
    }
})

chatRouter.get('/chat/get-all-messages/:userId', async (req, res, next) => {
    const user = req.params.userId;
    const messages = await Messages.find({ $or: [{ senderId: user }, { recipientId: user }] })
    return res.status(200).json({ success: true, messages });
})

chatRouter.all('/chat/delete-chat', async (req, res) => {
    const { senderId, recipientId, productId } = req.body;
    console.log(req.body);
    try {
        await Messages.deleteMany({ senderId: senderId, recipientId: recipientId, productId: productId });
        const updatedMessages = await Messages.find({}).sort({ createdAt: -1 });
        return res.status(200).json({
            success: true,
            messages: updatedMessages,
        })
    } catch (error) {
        return res.status(401).json({
            success: false,
            error: error,
        })
    }


})

export default chatRouter;