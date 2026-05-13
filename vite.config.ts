import { defineConfig } from "vite";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import babel from "@rolldown/plugin-babel";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), babel({ presets: [reactCompilerPreset()] })],
  base: "/study-react/", // 必须和仓库名一致，注意有斜杠
  css: {
    preprocessorOptions: {
      less: {
        // 允许在 less 里写 JS（常用）
        javascriptEnabled: true,
        // 全局注入变量（可选，比如主题色）
        modifyVars: {
          "primary-color": "#1890ff"
        }
        // 全局引入公共 less（可选）
        // additionalData: `@import "${path.resolve(__dirname, 'src/styles/vars.less')}";`
      }
    }
  }
});
