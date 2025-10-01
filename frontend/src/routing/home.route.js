import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "./routeTree";
import HomePage from "../pages/HomePage";
import { checkPublic } from "../utils/auth";

export const homeRoute = createRoute({
	getParentRoute: ()=> rootRoute, 
	path:"/",
	component:HomePage,
	beforeLoad: checkPublic
})
