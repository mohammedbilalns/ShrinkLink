import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "./routeTree";
import Dashboard from "../pages/DashboardPage";


export const dashboardRoute = createRoute({
	getParentRoute: () => rootRoute, 
	path:"/dashboard",
	component:Dashboard

})
