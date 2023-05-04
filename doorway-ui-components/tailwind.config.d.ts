export const important: boolean;
export const purge: boolean;
export namespace theme {
    const screens: {
        sm: string;
        md: string;
        lg: string;
        xl: string;
        "2xl": string;
        print: {
            raw: string;
        };
    };
    const fontSize: {
        "2xs": string;
        xs: string;
        sm: string;
        tiny: string;
        base: string;
        "base-alt": string;
        lg: string;
        xl: string;
        "2xl": string;
        "3xl": string;
        "4xl": string;
        "5xl": string;
        "6xl": string;
        "6.5xl": string;
        "7xl": string;
    };
    const fontFamily: {
        sans: string;
        serif: string;
        "alt-sans": string;
    };
    const colors: {
        primary: string;
        "primary-dark": string;
        "primary-darker": string;
        "primary-light": string;
        "primary-lighter": string;
        secondary: string;
        alert: string;
        "alert-light": string;
        "alert-dark": string;
        success: string;
        "success-light": string;
        "success-dark": string;
        warn: string;
        "warn-light": string;
        "warn-dark": string;
        "accent-cool": string;
        "accent-cool-light": string;
        "accent-cool-dark": string;
        "accent-warm": string;
        "accent-warm-dark": string;
        "accent-warm-light": string;
        "accent-warm-lighter": string;
        lush: string;
        white: string;
        black: string;
        blue: {
            800: string;
            700: string;
            600: string;
            300: string;
            200: string;
        };
        red: {
            700: string;
            300: string;
        };
        yellow: {
            700: string;
            300: string;
        };
        green: {
            700: string;
            300: string;
        };
        teal: {
            700: string;
            300: string;
        };
        gray: {
            950: string;
            900: string;
            850: string;
            800: string;
            750: string;
            700: string;
            650: string;
            600: string;
            550: string;
            500: string;
            450: string;
            400: string;
            300: string;
            200: string;
            100: string;
        };
    };
    namespace letterSpacing {
        const tightest: string;
        const tighter: string;
        const tight: string;
        const normal: string;
        const wide: string;
        const wider: string;
        const widest: string;
        const ultrawide: string;
    }
    namespace extend {
        function borderColor(theme: any): {
            DEFAULT: any;
        };
        const inset: {
            4: string;
            "-10": string;
        };
    }
}
