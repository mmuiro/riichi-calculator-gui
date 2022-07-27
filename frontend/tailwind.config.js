/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.{js,jsx,ts,tsx}"],
    theme: {
        extend: {
            gridTemplateC: {
                autofit: "repeat(auto-fit, 200px)",
            },
        },
    },
    plugins: [],
};
