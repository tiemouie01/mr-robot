import type { Config } from "tailwindcss";

export default {
  content: ["./src/views/*.ejs", "./dist/views/*.ejs"],
  theme: {
    extend: {},
  },
  plugins: [],
} satisfies Config;
