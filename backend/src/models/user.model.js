import mongoose  from "mongoose"

const userSchema = new mongoose.Schema({
	name:{
		type: String, 
		required: true
	},
	email: {
		type: String, 
		required: true,
		index: true 
	},
	password: {
		type: String, 
		required: true,
		select: false 
	},
	isVerified: {
		type: Boolean, 
		default: false
	}
}) 

const User = mongoose.model("User", userSchema)
export default User
