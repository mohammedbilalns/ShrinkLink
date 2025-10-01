import { Outlet } from "@tanstack/react-router"
import Navbar from "./components/Navbar"
import { Toaster } from "./components/ui/Toaster"

function RootLayout() {
  return (
    <>
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Toaster />
    </>
  )
}

export default RootLayout
