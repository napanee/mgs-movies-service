import {Menu as IconMenu} from '@mui/icons-material';
import {
	Toolbar as MuiToolbar,
	Typography as MuiTypography,
} from '@mui/material';

import * as S from './styles';


type HeaderProps = {
	isOpen: boolean;
	toggleDrawer: () => void;
};

const Header = ({isOpen, toggleDrawer: handleClick}: HeaderProps) => {
	return (
		<S.AppBar position="fixed" open={isOpen}>
			<MuiToolbar>
				<S.IconButton open={isOpen} aria-label="open drawer" onClick={handleClick} edge="start">
					<IconMenu />
				</S.IconButton>
				<MuiTypography variant="h6" noWrap component="div">
					Movie Database
				</MuiTypography>
			</MuiToolbar>
		</S.AppBar>
	);
};

export default Header;
