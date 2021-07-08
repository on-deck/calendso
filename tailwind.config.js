const ralewayFontFamily = [
    "Raleway",
    "ui-sans-serif",
    "system-ui",
    "-apple-system",
    "BlinkMacSystemFont",
    '"Segoe UI"',
    "Roboto",
    '"Helvetica Neue"',
    "Arial",
    '"Noto Sans"',
    "sans-serif",
    '"Apple Color Emoji"',
    '"Segoe UI Emoji"',
    '"Segoe UI Symbol"',
    '"Noto Color Emoji"',
];

const interFontFamily = [
    "Inter",
    "ui-sans-serif",
    "system-ui",
    "-apple-system",
    "BlinkMacSystemFont",
    '"Segoe UI"',
    "Roboto",
    '"Helvetica Neue"',
    "Arial",
    '"Noto Sans"',
    "sans-serif",
    '"Apple Color Emoji"',
    '"Segoe UI Emoji"',
    '"Segoe UI Symbol"',
    '"Noto Color Emoji"',
];

module.exports = {
    mode: "jit",
    purge: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
    darkMode: false, // or 'media' or 'class'
    theme: {
        extend: {
            fontFamily: {
                raleway: ralewayFontFamily,
                inter: interFontFamily,
            },
            colors: {
                gray: {
                    100: "#EBF1F5",
                    200: "#D9E3EA",
                    300: "#C5D2DC",
                    400: "#9BA9B4",
                    500: "#707D86",
                    600: "#55595F",
                    700: "#33363A",
                    800: "#25282C",
                    900: "#151719",
                },
                blue: {
                    100: "#b3e5fc",
                    200: "#81d4fa",
                    300: "#4fc3f7",
                    400: "#29b6f6",
                    500: "#03a9f4",
                    600: "#039be5",
                    700: "#0288d1",
                    800: "#0277bd",
                    900: "#01579b",
                },
                ondeck: {
                    DEFAULT: "#315CEA",
                },
            },
            maxHeight: {
                97: "25rem",
            },
        },
    },
    variants: {
        extend: {},
    },
    plugins: [require("@tailwindcss/forms")],
};
