import {Menu as IconMenu} from '@mui/icons-material';
import {
	AppBar as MuiAppBar,
	IconButton as MuiIconButton,
	Toolbar as MuiToolbar,
	Typography as MuiTypography,
} from '@mui/material';
import styled, {DefaultTheme} from 'styled-components';

import {drawerWidth} from '@utils/constants';


type AppBarProps = {
	open: boolean;
	theme: DefaultTheme;
};

type IconButtonProps = {
	open: boolean;
};

type HeaderProps = {
	isOpen: boolean;
	toggleDrawer: () => void;
};

const marginWidthTransition = ({open, theme}: AppBarProps) => {
	let easing = theme.transitions.easing.sharp;
	let duration = theme.transitions.duration.leavingScreen;
	let marginLeft = '0';
	let width = '100%';

	if (open) {
		easing = theme.transitions.easing.easeOut;
		duration = theme.transitions.duration.enteringScreen;
		marginLeft = `${drawerWidth}px`;
		width = `calc(100% - ${drawerWidth}px)`;
	}

	const transition = theme.transitions.create(['margin', 'width'], {easing, duration});

	return `
		transition: ${transition};
		margin-left: ${marginLeft};
		width: ${width};
	`;
};

const AppBar = styled(MuiAppBar)(marginWidthTransition);
const IconButton = styled(MuiIconButton)`
	${({theme}) => `margin-right: ${theme.spacing(2)};`}
	${({open}: IconButtonProps) => open && 'display: none;'}
`;

const Header = ({isOpen, toggleDrawer: handleClick}: HeaderProps) => {
	return (
		<AppBar position="fixed" open={isOpen}>
			<MuiToolbar>
				<IconButton open={isOpen} aria-label="open drawer" onClick={handleClick} edge="start">
					<IconMenu />
				</IconButton>
				<MuiTypography variant="h6" noWrap component="div">
					Movie Database
				</MuiTypography>
			</MuiToolbar>
		</AppBar>
	);
};

export default Header;
