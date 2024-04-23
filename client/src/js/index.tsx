import {ApolloClient, ApolloProvider, HttpLink, InMemoryCache} from '@apollo/client';
import {relayStylePagination} from '@apollo/client/utilities';
import {CssBaseline} from '@mui/material';
import {StyledEngineProvider, ThemeProvider} from '@mui/material/styles';
import {createRoot} from 'react-dom/client';
import {BrowserRouter} from 'react-router-dom';

import Modal from '@generic/modal/Modal';
import {Provider as StoreProvider, stores} from '@stores/index';

import App from './components/app';
import theme from './theme';


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

const link = new HttpLink({uri: process.env.API_URL});
const cache = new InMemoryCache({
	typePolicies: {
		Query: {
			fields: {
				actors: relayStylePagination(),
			},
		},
	},
});
const client = new ApolloClient({link, cache});
const container = document.getElementById('root');
const root = createRoot(container!);

root.render(
	<BrowserRouter basename="/admin">
		<StyledEngineProvider injectFirst>
			<ThemeProvider theme={theme}>
				<CssBaseline />
				<ApolloProvider client={client}>
					<StoreProvider value={stores}>
						<App />
						<Modal />
					</StoreProvider>
				</ApolloProvider>
			</ThemeProvider>
		</StyledEngineProvider>
	</BrowserRouter>
);
