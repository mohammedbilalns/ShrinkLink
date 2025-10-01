import { redirect } from "@tanstack/react-router";
import { getCurrentUser } from "../api/user.api";
import { login } from "../store/slices/authSlice";

export const checkAuth = async ({context}) => {
  try {
    const store = context.store;
    const queryClient = context.queryClient;
    const { isAuthenticated } = store.getState().auth;
    
    if (isAuthenticated) {
      return true;
    }

    const data = await queryClient.fetchQuery({
      queryKey: ["currentUser"],
      queryFn: getCurrentUser,
    });

    store.dispatch(login(data.user));
    return true;
  } catch (err) {
    store.dispatch(logout());
    queryClient.removeQueries(["currentUser"]);
    return redirect({to: "/auth"});
  }
};

export const checkPublic = async ({context}) => {
  try {
    const store = context.store;
    const queryClient = context.queryClient;

    const { isAuthenticated } = store.getState().auth;
    
    if (isAuthenticated) {
      return redirect({to: "/dashboard"});
    }

    const data = await queryClient.fetchQuery({
      queryKey: ["currentUser"],
      queryFn: getCurrentUser,
    });

    store.dispatch(login(data.user));
    return redirect({to: "/dashboard"});
  } catch (err) {
    return true;
  }
};
