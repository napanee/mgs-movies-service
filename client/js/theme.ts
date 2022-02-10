import {Theme} from '@mui/material';
import {createTheme} from '@mui/material/styles';


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

const theme = createTheme({
	breakpoints: {
		values: {
			xs: 0,
			sm: 600,
			md: 1000,
			lg: 1200,
			xl: 1920,
		},
	},
});

export default theme;
