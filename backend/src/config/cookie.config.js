export const accessCookieOptions = {
	httpOnly: true , 
	secure: process.env.NODE_ENV == "production",
	sameSite: "Lax",
	maxAge: 1000* 60 * 5
}

export const refreshCookieOptions = {
	httpOnly: true , 
	secure: process.env.NODE_ENV == "production",
	sameSite: "Lax",
	maxAge: 1000* 60 * 60 * 24 * 30
}
