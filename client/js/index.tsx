import {CssBaseline} from '@mui/material';
import {StyledEngineProvider, ThemeProvider} from '@mui/material/styles';
import {render} from 'react-dom';
import {BrowserRouter} from 'react-router-dom';
import {ThemeProvider as StyledComponentsThemeProvider} from 'styled-components';

import App from './components/app';
import theme from './theme';


render(
	<BrowserRouter basename="/admin">
		<StyledEngineProvider injectFirst>
			<ThemeProvider theme={theme}>
				<StyledComponentsThemeProvider theme={theme}>
					<CssBaseline />
					<App />
				</StyledComponentsThemeProvider>
			</ThemeProvider>
		</StyledEngineProvider>
	</BrowserRouter>,
	document.getElementById('root')
);
