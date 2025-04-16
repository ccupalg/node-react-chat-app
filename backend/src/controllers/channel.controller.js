import Channel from "../models/channel.model.js";
import Message from "../models/message.model.js";

export const createChannel = async (req, res) => {
	try {
		const { name, description, members = [] } = req.body;

		const channel = new Channel({
			name,
			description,
			members: [req.user._id, ...members],
			createdBy: req.user._id,
		});

		await channel.save();
		res.status(201).json(channel);
	} catch (error) {
		console.error("Error creating channel:", error.message);
		res.status(500).json({ message: "Internal server error" });
	}
};

export const getChannels = async (req, res) => {
	try {
		const channels = await Channel.find({ members: req.user._id });
		res.status(200).json(channels);
	} catch (error) {
		console.error("Error fetching channels:", error.message);
		res.status(500).json({ message: "Internal server error" });
	}
};

export const getChannelDetails = async (req, res) => {
	try {
		const channelId = req.params.id;
		const channel = await Channel.findById(channelId);
		if (!channel) {
			return res.status(404).json({ message: "Channel not found" });
		}
		res.status(200).json(channel.messages);
	} catch (error) {
		console.error("Error fetching messages:", error.message);
		res.status(500).json({ message: "Internal server error" });
	}
};

export const getChannelMessages = async (req, res) => {
	try {
		const channelId = req.params.id;

		const messages = await Message.find({
			receiverId: channelId,
		});

		res.status(200).json(messages);
	} catch (error) {
		console.log("Error in getChannelMessages controller: ", error.message);
		res.status(500).json({ error: "Internal server error" });
	}
};
