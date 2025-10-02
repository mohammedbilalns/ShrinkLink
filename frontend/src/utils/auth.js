import { redirect } from "@tanstack/react-router";
import { getCurrentUser } from "../api/user.api";
import { login, logout } from "../store/slices/authSlice";
import store from "../store";

export const checkAuth = async ({context}) => {
  try {
    const queryClient = context.queryClient;
  
    const data = await queryClient.fetchQuery({
      queryKey: ["currentUser"],
      queryFn: getCurrentUser,
    });

    store.dispatch(login(data.user));
    return true;
  } catch (err) {
		console.log(err);
    store.dispatch(logout());
    return redirect({to: "/auth"});
  }
};

export const checkPublic = async ({context}) => {
  try {
    const queryClient = context.queryClient;
    const { isAuthenticated } = store.getState().auth;
    
    if (isAuthenticated) {
      return redirect({to: "/dashboard"});
    }

    const data = await queryClient.fetchQuery({
      queryKey: ["currentUser"],
      queryFn: getCurrentUser,
      retry: false, 
      staleTime: 0,
    });
    
    store.dispatch(login(data.user));
    return redirect({to: "/dashboard"});
  } catch (err) {
		console.log(err);
    store.dispatch(logout());
    return true;
  }
};
