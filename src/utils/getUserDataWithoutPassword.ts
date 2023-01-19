export const getUserDataWithoutPassword = (user: any, token: string) => {
	if (!user._doc) {
		return;
	}

	const { password, ...userData } = user._doc;

	return { ...userData, token };
};
