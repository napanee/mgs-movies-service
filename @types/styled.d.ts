import {Theme} from '@mui/material';
import {ThemeOptions} from '@mui/material/styles';


type PaletteNeutral = 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;

declare module 'styled-components' {
	// eslint-disable-next-line @typescript-eslint/no-empty-interface
	export interface DefaultTheme extends Theme {}
}

declare module '@mui/material/styles/createPalette' {
	export interface PaletteOptions {
		neutral: {[key in PaletteNeutral]: string};
	}
}

declare module '@mui/material/styles/createTheme' {
	interface CustomTheme extends Theme {
		status: {
			danger: string;
		};
	}

	// allow configuration using `createTheme`
	interface CustomThemeOptions extends ThemeOptions {
		status?: {
			danger?: string;
		};
	}

	export function createTheme(options?: CustomThemeOptions): CustomTheme;
}
