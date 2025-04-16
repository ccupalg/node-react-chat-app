import mongoose from "mongoose";

const channelSchema = new mongoose.Schema(
	{
		name: { type: String, required: true },
		description: { type: String },
		members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
		createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
	},
	{ timestamps: true }
);

const Channel = mongoose.model("Channel", channelSchema);

export default Channel;
