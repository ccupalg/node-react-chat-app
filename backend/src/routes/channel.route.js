import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { createChannel, getChannels, getChannelDetails, getChannelMessages, addMembers, removeMembers } from "../controllers/channel.controller.js";

const router = express.Router();

router.post("/", protectRoute, createChannel);
router.get("/", protectRoute, getChannels);   // Get all channels for the logged-in user
router.get("/:id", protectRoute, getChannelDetails); // Get messages for a specific channel
router.get("/:id/messages", protectRoute, getChannelMessages); // Get messages for a specific channel
router.post("/:id/members", protectRoute, addMembers) // add members to channel
router.delete("/:id/members", protectRoute, removeMembers) // remove members from channel

export default router;