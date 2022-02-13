import {PaletteOptions, Theme} from '@mui/material';

import {PaletteType} from '../client/js/theme';


declare module 'styled-components' {
	export interface DefaultTheme extends Theme {
		palette: PaletteOptions;
	}
}

declare module '@mui/material/styles/createPalette' {
	export interface PaletteOptions {
		type: {
			[key in PaletteType]: {
				dark: string;
				light: string;
			}
		};
	}
}
