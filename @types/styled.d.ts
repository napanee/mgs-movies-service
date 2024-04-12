import {PaletteType} from '~/theme';


declare module '@mui/material/styles' {
	interface Theme {
		drawer: {
			width: number;
		};
	}

	interface ThemeOptions {
		drawer: {
			width: number;
		};
	}

	interface Palette {
		type: {
			[key in PaletteType]: {
				dark: string;
				light: string;
			}
		};
	}

	interface PaletteOptions {
		type: {
			[key in PaletteType]: {
				dark: string;
				light: string;
			}
		};
	}

	interface ZIndex {
		background: number;
		base: number;
	}
}
