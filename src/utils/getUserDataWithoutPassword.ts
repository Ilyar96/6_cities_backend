export const getUserDataWithoutPassword = (user: any, token: string = null) => {
	if (!user._doc) {
		return;
	}

	const { password, ...userData } = user._doc;

	if (!token) {
		return userData;
	}

	return { ...userData, token };
};
