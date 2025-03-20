import express from "express";
import messageController from '../controllers/message-controller.js';


const messageRouter = express.Router();

messageRouter.post('/:id/send', messageController.sendMessage);
messageRouter.get('/', messageController.getMessage);
messageRouter.patch('/:id/read', messageController.markAsRead);
messageRouter.post('/reply', messageController.replyMessage);

export default messageRouter;