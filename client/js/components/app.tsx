import {Box as MuiBox} from '@mui/material';
import {useState} from 'react';
import {Route, Routes} from 'react-router-dom';
import styled from 'styled-components';

import Actors from '@pages/actors';
import Dashboard from '@pages/dashboard';
import Directors from '@pages/directors';
import Movies from '@pages/movies';

import Header from '@components/core/header';
import Sidebar, {DrawerHeader} from '@components/core/sidebar';
import Main from '@components/layout/main';


const Box = styled(MuiBox)`
	display: flex;
`;

const App = () => {
	const [isOpen, setIsOpen] = useState(false);
	const toggleDrawer = () => {
		setIsOpen((isOpen) => !isOpen);
	};

	return (
		<Box>
			<Header isOpen={isOpen} toggleDrawer={toggleDrawer} />
			<Sidebar isOpen={isOpen} toggleDrawer={toggleDrawer} />
			<Main open={isOpen}>
				<DrawerHeader />
				<Routes>
					<Route path="/" element={<Dashboard />} />
					<Route path="movies" element={<Movies />} />
					<Route path="actors" element={<Actors />} />
					<Route path="directors" element={<Directors />} />
				</Routes>
			</Main>
		</Box>
	);
};

export default App;
