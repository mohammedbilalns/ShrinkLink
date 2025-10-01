import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import "@radix-ui/themes/styles.css";
import { Theme } from "@radix-ui/themes";
import {QueryClientProvider, QueryClient} from "@tanstack/react-query"

const queryClient = new QueryClient()

createRoot(document.getElementById("root")).render(
	<QueryClientProvider client={queryClient}>
		<Theme>
			<App />
		</Theme>
	</QueryClientProvider>
);
