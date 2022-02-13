import {ApolloClient, ApolloProvider, HttpLink, InMemoryCache} from '@apollo/client';
import {CssBaseline} from '@mui/material';
import {StyledEngineProvider, ThemeProvider} from '@mui/material/styles';
import {render} from 'react-dom';
import {BrowserRouter} from 'react-router-dom';
import {ThemeProvider as StyledComponentsThemeProvider} from 'styled-components';

import App from './components/app';
import theme from './theme';


const link = new HttpLink({uri: process.env.API_URL});
const cache = new InMemoryCache();
const client = new ApolloClient({link, cache});

render(
	<BrowserRouter basename="/admin">
		<StyledEngineProvider injectFirst>
			<ThemeProvider theme={theme}>
				<StyledComponentsThemeProvider theme={theme}>
					<CssBaseline />
					<ApolloProvider client={client}>
						<App />
					</ApolloProvider>
				</StyledComponentsThemeProvider>
			</ThemeProvider>
		</StyledEngineProvider>
	</BrowserRouter>,
	document.getElementById('root')
);
