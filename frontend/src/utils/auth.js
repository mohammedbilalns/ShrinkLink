import { redirect } from "@tanstack/react-router";
import { getCurrentUser } from "../api/user.api";
import { login } from "../store/slices/authSlice";

export const checkAuth = async ({context}) => {

	try{
		const store = context.store
		const queryClient = context.queryClient

		const data = await queryClient.ensureQueryData({
			queryKey: ["currentUser"],
			queryFn: getCurrentUser, 
		})

		store.dispatch(login(data.user))
		const {isAuthenticated} = store.getState().auth
		if(!isAuthenticated){
			return redirect({to:"/auth"})
		}
		return true
	}
	catch(err){
		return redirect({to:"/auth"})
	}
}

export const checkPublic = async ({context}) => {
	try{
		const store = context.store
		const queryClient = context.queryClient

		const data = await queryClient.ensureQueryData({
			queryKey: ["currentUser"],
			queryFn: getCurrentUser, 
		})

		store.dispatch(login(data.user))
		const {isAuthenticated} = store.getState().auth
		if(isAuthenticated){
			return redirect({to:"/dashboard"})
		}
		return true  
	}
	catch(err){
		return true  
	}
}
