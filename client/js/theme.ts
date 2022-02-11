import {createTheme} from '@mui/material/styles';


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
	palette: {
		action: {
			// active: 'rgba(0, 0, 0, 0.8)',
			selectedOpacity: 0.2,
		},
	},
});

export default theme;
