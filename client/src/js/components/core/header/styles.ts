import {
	AppBar as MuiAppBar,
	IconButton as MuiIconButton,
} from '@mui/material';
import {css, styled} from '@mui/material/styles';


export const AppBar = styled(MuiAppBar)<{open: boolean}>`
	transition: ${({open, theme: {transitions: {create, duration, easing}}}) => create(
		['margin', 'width'],
		{
			easing: open ? easing.sharp : easing.easeOut,
			duration: open ? duration.leavingScreen : duration.enteringScreen,
		}
	)};
	margin-left: ${({open, theme}) => open ? theme.drawer.width : 0};
	width: ${({open, theme}) => open ? `calc(100% - ${theme.drawer.width}px)` : '100%'};
`;

export const IconButton = styled(MuiIconButton)<{open: boolean}>`
	margin-right: ${({theme}) => theme.spacing(2)};

	${({open}) => open && css`
		display: none;
	`}
`;
