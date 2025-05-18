import mongoose from "mongoose";

const channelSchema = new mongoose.Schema(
	{
		name: { type: String, required: true },
		description: { type: String },
		members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
		createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
		status: {
			enum: ["ACTIVE", "FREEZE", "DELETE"],
			type: String,
			default: "ACTIVE",
		},
		pinnedChannel: [
			{
				pinnedFor: {
					enum: ["SELF", "GLOBAL"],
					default: "SELF",
					type: String,
				},
				pinnedBy: {
					type: mongoose.Schema.Types.ObjectId,
					ref: "User",
				},
			},
		],
		pinnedMessages: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "Message",
			},
		],
	},
	{ timestamps: true }
);

const Channel = mongoose.model("Channel", channelSchema);

export default Channel;
