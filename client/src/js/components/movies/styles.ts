import {Box as MuiBox} from '@mui/material';
import {styled} from '@mui/material/styles';


export const Box = styled(MuiBox)`
	position: relative;

	.logo {
		position: absolute;
		bottom: 1rem;
		left: 1rem;
		width: 50%;
	}
`;
