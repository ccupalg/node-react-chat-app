const Typing = ({ userFullName = "" }) => {
	return (
		<p className="text-gray-500 ml-4 italic flex items-center space-x-1">
			{userFullName ? (
				<span>{userFullName || "User"} is typing</span>
			) : (
				<span>typing</span>
			)}
			<span className="dot-animate w-4 text-lg flex">
				<span className="dot delay-0">.</span>
				<span className="dot delay-150">.</span>
				<span className="dot delay-300">.</span>
			</span>
		</p>
	);
};

export default Typing;
