import {useState} from 'react';
import {Route, Routes} from 'react-router-dom';

import Actors from '@pages/actors';
import Dashboard from '@pages/dashboard';
import Directors from '@pages/directors';
import Movies from '@pages/movies';

import {Header, Sidebar} from '@components/core';
import Main from '@components/layout/main';

import * as S from './styles';


const App = () => {
	const [isOpen, setIsOpen] = useState(false);
	const toggleDrawer = () => setIsOpen((isOpen) => !isOpen);

	return (
		<S.Box>
			<Header isOpen={isOpen} toggleDrawer={toggleDrawer} />
			<Sidebar isOpen={isOpen} toggleDrawer={toggleDrawer} />
			<Main open={isOpen}>
				<S.DrawerHeader />
				<Routes>
					<Route path="/" element={<Dashboard />} />
					<Route path="movies" element={<Movies />} />
					<Route path="actors" element={<Actors />} />
					<Route path="directors" element={<Directors />} />
				</Routes>
			</Main>
		</S.Box>
	);
};

export default App;
