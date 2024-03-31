import {
	Box as MuiBox,
	Card as MuiCard,
	Divider as MuiDivider,
	css,
} from '@mui/material';
import {styled} from '@mui/material/styles';

import {PaletteType} from '~/theme';


export const Divider = styled(MuiDivider)`
	margin: ${({theme}) => theme.spacing(2, 0)};
	height: 1px;
	background-image: linear-gradient(to right, rgba(52, 71, 103, 0), rgba(52, 71, 103, 0.4), rgba(52, 71, 103, 0));
	border: 0;
`;

export const Card = styled(MuiCard)`
	overflow: visible;
	height: 100%;
`;

export const Box = styled(MuiBox, {shouldForwardProp: (prop) => prop !== 'isInner'})<{isInner?: boolean}>`
	display: flex;
	align-items: flex-start;
	justify-content: space-between;
	${({isInner}) => isInner && css`
		flex-direction: column;
		align-items: flex-end;
	`}
`;

export const BoxIcon = styled(MuiBox)<{type: PaletteType}>`
	transform: translateY(-50%);
	padding: ${({theme}) => theme.spacing(1.5)};
	background: ${({theme, type}) =>
		`linear-gradient(to bottom right, ${theme.palette.type[type].dark}, ${theme.palette.type[type].light})`};
	border-radius: ${({theme}) => `${theme.shape.borderRadius}px`};

	svg {
		display: block;
	}
`;
