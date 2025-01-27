/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./src/*.jsx', './src/components/*.jsx'],
    theme: {
        extend: {
            colors: {
                sparkasse: {
                    red: '#FF0000',
                    darkred: '#CC0000',
                    gray: '#4A4A4A',
                    lightgray: '#F5F5F5',
                },
            },
        },
    },
    plugins: [],
};
