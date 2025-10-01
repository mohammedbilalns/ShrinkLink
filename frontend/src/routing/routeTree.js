import { createRootRoute } from "@tanstack/react-router"
import RootLayout from "../RootLayout"
import { authRoute } from "./auth.route"
import { homeRoute } from "./home.route"
import { dashboardRoute } from "./dashboard.route"

export const rootRoute = createRootRoute({
  component:RootLayout
})

export const routeTree = rootRoute.addChildren([authRoute, homeRoute,dashboardRoute])


