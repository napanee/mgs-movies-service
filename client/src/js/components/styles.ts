import {Box as MuiBox} from '@mui/material';
import {styled} from '@mui/material/styles';


const DrawerHeaderStyled = styled('div')`
	display: flex;
	align-items: center;
	justify-content: flex-end;
	padding: ${(({theme}) => theme.spacing(0, 1))};
`;

export const DrawerHeader = styled(DrawerHeaderStyled)`
	${({theme}) => theme.mixins.toolbar};
`;

export const Box = styled(MuiBox)`
	display: flex;
`;
