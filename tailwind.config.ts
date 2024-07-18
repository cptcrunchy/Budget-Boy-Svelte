import type { Config } from "tailwindcss";
import daisyui from 'daisyui';
import typography from '@tailwindcss/typography'

export default {
    content: ["./src/**/*.{html,js,svelte,ts}"],

    theme: {
       fontFamily: {
        'body': ['Roboto', 'Gill Sans MT', 'Calibri', 'Trebuchet MS', 'sans-serif']
       }
    },

    plugins: [typography, daisyui],
    daisyui: {
      themes: ['light', 'night'],
      darkTheme: 'dark',
      base: true,
      styled: true,
      utils: true,
      logs: true
    }
} as Config;