import {createTheme, lighten} from '@mui/material/styles';


const theme = createTheme({
	drawer: {
		width: 240,
	},
	breakpoints: {
		values: {
			xs: 0,
			sm: 500,
			md: 768,
			lg: 1200,
			xl: 1920,
		},
	},
	palette: {
		action: {
			// active: 'rgba(0, 0, 0, 0.8)',
			selectedOpacity: 0.2,
		},
		background: {
			default: 'rgb(240, 242, 245)',
		},
		type: {
			movie: {
				dark: '#ED6C02',
				light: lighten('#ED6C02', 0.5),
			},
			genre: {
				dark: '#D32F2F',
				light: lighten('#D32F2F', 0.5),
			},
			actor: {
				dark: '#9C27B0',
				light: lighten('#9C27B0', 0.5),
			},
			director: {
				dark: '#2E7D32',
				light: lighten('#2E7D32', 0.5),
			},
		},
	},
	typography: {
		h4: {
			fontSize: '24px',
			lineHeight: 1.375,
			color: '#344767',
			fontWeight: 700,
		},
	},
	zIndex: {
		background: -1,
		base: 0,
	},
});

export default theme;
