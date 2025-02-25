import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const proxyAddress = "http://localhost:5000";

// https://vite.dev/config/
export default defineConfig({
	plugins: [react()],
	server: {
		proxy: {
			"/api": proxyAddress,
			"/count": proxyAddress,
			"/track": proxyAddress,
		},
	},
});
