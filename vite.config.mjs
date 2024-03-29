import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(() => {
	return {
		build: {
			outDir: 'build',
		},
		plugins: [react()],
    server: {
			host: true,
			port: 3000,
			strictPort: true,
      proxy: {
        "^/(api|socket.io).*": "http://localhost:3001",
      }
		}
	};
});