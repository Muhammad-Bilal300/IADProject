import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig({
  // server: {
  //   proxy: {
  //     "/backend": {
  //       target: "http://127.0.0.1:3000",
  //       secure: false,
  //       changeOrigin: true,
  //     },
  //   },
  // },
  plugins: [react()],
});
