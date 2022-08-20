import {Drawer as MuiDrawer} from '@mui/material';
import {styled} from '@mui/material/styles';


export const Drawer = styled(MuiDrawer)`
	flex-shrink: 0;
	width: ${({theme}) => theme.drawer.width}px;

	/* stylelint-disable-next-line selector-class-pattern */
	.MuiDrawer-paper {
		box-sizing: border-box;
		width: ${({theme}) => theme.drawer.width}px;
	}
`;
