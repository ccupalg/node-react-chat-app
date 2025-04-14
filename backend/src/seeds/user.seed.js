import { config } from "dotenv";
import { connectDB } from "../lib/db.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

config();

const seedUsers = [
	// Female Users
	{
		email: "ella.hart@example.com",
		fullName: "Ella Hart",
		password: "123456",
		profilePic: "https://randomuser.me/api/portraits/women/1.jpg",
	},
	{
		email: "grace.lee@example.com",
		fullName: "Grace Lee",
		password: "123456",
		profilePic: "https://randomuser.me/api/portraits/women/2.jpg",
	},
	{
		email: "zoey.kim@example.com",
		fullName: "Zoey Kim",
		password: "123456",
		profilePic: "https://randomuser.me/api/portraits/women/3.jpg",
	},
	{
		email: "luna.ward@example.com",
		fullName: "Luna Ward",
		password: "123456",
		profilePic: "https://randomuser.me/api/portraits/women/4.jpg",
	},
	{
		email: "nora.hughes@example.com",
		fullName: "Nora Hughes",
		password: "123456",
		profilePic: "https://randomuser.me/api/portraits/women/5.jpg",
	},
	{
		email: "scarlett.evans@example.com",
		fullName: "Scarlett Evans",
		password: "123456",
		profilePic: "https://randomuser.me/api/portraits/women/6.jpg",
	},
	{
		email: "aria.hill@example.com",
		fullName: "Aria Hill",
		password: "123456",
		profilePic: "https://randomuser.me/api/portraits/women/7.jpg",
	},
	{
		email: "chloe.green@example.com",
		fullName: "Chloe Green",
		password: "123456",
		profilePic: "https://randomuser.me/api/portraits/women/8.jpg",
	},

	// Male Users
	{
		email: "logan.bennett@example.com",
		fullName: "Logan Bennett",
		password: "123456",
		profilePic: "https://randomuser.me/api/portraits/men/1.jpg",
	},
	{
		email: "jackson.rivera@example.com",
		fullName: "Jackson Rivera",
		password: "123456",
		profilePic: "https://randomuser.me/api/portraits/men/2.jpg",
	},
	{
		email: "leo.cox@example.com",
		fullName: "Leo Cox",
		password: "123456",
		profilePic: "https://randomuser.me/api/portraits/men/3.jpg",
	},
	{
		email: "sebastian.richards@example.com",
		fullName: "Sebastian Richards",
		password: "123456",
		profilePic: "https://randomuser.me/api/portraits/men/4.jpg",
	},
	{
		email: "theo.henderson@example.com",
		fullName: "Theo Henderson",
		password: "123456",
		profilePic: "https://randomuser.me/api/portraits/men/5.jpg",
	},
	{
		email: "ezra.brooks@example.com",
		fullName: "Ezra Brooks",
		password: "123456",
		profilePic: "https://randomuser.me/api/portraits/men/6.jpg",
	},
	{
		email: "miles.foster@example.com",
		fullName: "Miles Foster",
		password: "123456",
		profilePic: "https://randomuser.me/api/portraits/men/7.jpg",
	},
];


const seedDatabase = async () => {
	try {
		const usersPasswordHashed = [];

		for (let i = 0; i < seedUsers.length; i++) {
			//const hashedPassword = await bcrypt.hash(password, salt);

			const salt = await bcrypt.genSalt(10);
			const hashedPassword = await bcrypt.hash(
				seedUsers[i].password,
				salt
			);
			usersPasswordHashed.push({
				...seedUsers[i],
				password: hashedPassword,
			});
		}

		// Connect to the database
		await connectDB();

		// remove the user expect shishupal@ariveguru.com
		await User.deleteMany({ email: { $ne: "shishupal@ariveguru.com" } });

		await User.insertMany(usersPasswordHashed);
		console.log("Database seeded successfully");
	} catch (error) {
		console.error("Error seeding database:", error);
	}
};

// call and close the node process with try catch
try {
	await seedDatabase();
} catch (error) {
	console.error("Error seeding database:", error);
	process.exit(1);
} finally {
	// Close the database connection
	console.log("Database connection closed");
	process.exit(0);
}
