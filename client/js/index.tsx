import {CssBaseline} from '@mui/material';
import {StyledEngineProvider} from '@mui/material/styles';
import {Fragment} from 'react';
import {render} from 'react-dom';
import {ThemeProvider as StyledComponentsThemeProvider} from 'styled-components';

import App from './components/app';
import theme from './theme';


render(
	<Fragment>
		<StyledEngineProvider injectFirst>
			<StyledComponentsThemeProvider theme={theme}>
				<CssBaseline />
				<App />
			</StyledComponentsThemeProvider>
		</StyledEngineProvider>
	</Fragment>,
	document.getElementById('root')
);
