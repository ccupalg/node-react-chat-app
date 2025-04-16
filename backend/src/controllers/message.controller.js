import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import Channel from "../models/channel.model.js";

import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId, io } from "../lib/socket.js";

import mongoose from "mongoose";

export const getUsersForSidebar = async (req, res) => {
	try {
		const loggedInUserId = req.user._id;
		const filteredUsers = await User.find({
			_id: { $ne: loggedInUserId },
		}).select("-password");

		res.status(200).json(filteredUsers);
	} catch (error) {
		console.error("Error in getUsersForSidebar: ", error.message);
		res.status(500).json({ error: "Internal server error" });
	}
};

export const getUserMessages = async (req, res) => {
	try {
		const { id: userToChatId } = req.params;
		const myId = req.user._id;

		// find in the db for channel doc
		const isChannel = await Channel.exists({ _id: userToChatId });

		let messages = [];

		const projection = {
			_id: 1,
			text: 1,
			receiverId: 1,
			senderId: 1,
			createdAt: 1,
			updatedAt: 1,
			image: 1,
			sender: {
				email: "$sender.email",
				fullName: "$sender.fullName",
				profilePic: "$sender.profilePic",
			},
		};

		if (isChannel) {
			messages = await Message.aggregate([
				{
					$match: {
						receiverId:
							mongoose.Types.ObjectId.createFromHexString(userToChatId),
					},
				},
				{
					$lookup: {
						from: "users",
						localField: "senderId",
						foreignField: "_id",
						as: "sender",
					},
				},
				{ $unwind: "$sender" },
				{
					$project: projection,
				},
			]);
		} else {
			messages = await Message.aggregate([
				{
					$match: {
						$or: [
							{
								senderId: myId,
								receiverId:
									mongoose.Types.ObjectId.createFromHexString(userToChatId),
							},
							{
								senderId:
									mongoose.Types.ObjectId.createFromHexString(userToChatId),
								receiverId: myId,
							},
						],
					},
				},
				{
					$lookup: {
						from: "users",
						localField: "senderId",
						foreignField: "_id",
						as: "sender",
					},
				},
				{ $unwind: "$sender" },
				{
					$project: projection,
				},
			]);
		}

		res.status(200).json(messages);
	} catch (error) {
		console.log("Error in getUserMessages controller: ", error.message);
		res.status(500).json({ error: "Internal server error" });
	}
};

export const sendMessage = async (req, res) => {
	try {
		const { text, image, messageType } = req.body;
		const { id: receiverId } = req.params;
		const senderId = req.user._id;

		let imageUrl;
		if (image) {
			// Upload base64 image to cloudinary
			const uploadResponse = await cloudinary.uploader.upload(image);
			imageUrl = uploadResponse.secure_url;
		}

		const messageData = {
			senderId,
			receiverId,
			text,
			image: imageUrl,
		};

		if (messageType) {
			messageData.messageType = messageType;
		}

		const newMessage = new Message(messageData);

		await newMessage.save();

		const latestMessage = await Message.aggregate([
			{ $match: { _id: newMessage._id } },
			{
				$lookup: {
					from: "users",
					localField: "senderId",
					foreignField: "_id",
					as: "sender",
				},
			},
			{ $unwind: "$sender" },
			{
				$project: {
					_id: 1,
					text: 1,
					receiverId: 1,
					senderId: 1,
					createdAt: 1,
					updatedAt: 1,
					image: 1,
					sender: {
						email: "$sender.email",
						fullName: "$sender.fullName",
						profilePic: "$sender.profilePic",
					},
				},
			},
		]);
		

		// notify the receiver using socket.io
		if (messageType === "CHANNEL") {
			if (receiverId) {
				const roomName = `channel_${receiverId}`;
				io.to(roomName).emit("newMessage", latestMessage?.[0]);
			}
		} else {
			// Emit the message to the receiver
			// The receiverId is the socket id of the receiver
			const receiverSocketId = getReceiverSocketId(receiverId);
			if (receiverSocketId) {
				io.to(receiverSocketId).emit("newMessage", latestMessage?.[0]);
			}
		}

		res.status(201).json(newMessage);
	} catch (error) {
		console.log("Error in sendMessage controller: ", error.message);
		res.status(500).json({ error: "Internal server error" });
	}
};
