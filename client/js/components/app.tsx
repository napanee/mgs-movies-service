import {Box as MuiBox, Typography as MuiTypography} from '@mui/material';
import {useState} from 'react';
import styled from 'styled-components';

import Header from './core/header';
import Sidebar, {DrawerHeader} from './core/sidebar';
import Main from './layout/main';


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
				<MuiTypography paragraph>
					Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
					tempor incididunt ut labore et dolore magna aliqua. Rhoncus dolor purus non
					enim praesent elementum facilisis leo vel. Risus at ultrices mi tempus
					imperdiet. Semper risus in hendrerit gravida rutrum quisque non tellus.
					Convallis convallis tellus id interdum velit laoreet id donec ultrices.
					Odio morbi quis commodo odio aenean sed adipiscing. Amet nisl suscipit
					adipiscing bibendum est ultricies integer quis. Cursus euismod quis viverra
					nibh cras. Metus vulputate eu scelerisque felis imperdiet proin fermentum
					leo. Mauris commodo quis imperdiet massa tincidunt. Cras tincidunt lobortis
					feugiat vivamus at augue. At augue eget arcu dictum varius duis at
					consectetur lorem. Velit sed ullamcorper morbi tincidunt. Lorem donec massa
					sapien faucibus et molestie ac.
				</MuiTypography>
			</Main>
		</Box>
	);
};

export default App;
