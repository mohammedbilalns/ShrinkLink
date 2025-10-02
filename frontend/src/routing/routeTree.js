import { createRootRoute } from "@tanstack/react-router"
import RootLayout from "../RootLayout"
import { authRoute } from "./auth.route"
import { homeRoute } from "./home.route"
import { dashboardRoute } from "./dashboard.route"
import ErrorPage from "../pages/ErrorPage"
import NotFoundPage from "../pages/NotFoundPage"

export const rootRoute = createRootRoute({
  component:RootLayout,
	errorComponent: ErrorPage,
	notFoundComponent: NotFoundPage,
	
})

export const routeTree = rootRoute.addChildren([authRoute, homeRoute,dashboardRoute])


