import {Box, Tab as MuiTab, Tabs as MuiTabs, css, styled} from '@mui/material';


export const Tabs = styled(MuiTabs)`
	flex: 1 0 auto;
`;

export const Tab = styled(MuiTab)`
	justify-content: flex-start;
	min-height: auto;
`;

export const Bottom = styled(Box)`
	${({theme}) => css`
		background-color: ${theme.palette.primary.main};
	`}

	display: flex;
	justify-content: flex-end;
	gap: 5px;
`;
