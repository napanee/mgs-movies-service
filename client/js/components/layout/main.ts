import {Theme, css, styled} from '@mui/material/styles';


type MainProps = {
	open: boolean;
	theme: Theme;
};

const marginTransition = ({open, theme}: MainProps) => {
	let easing = theme.transitions.easing.sharp;
	let duration = theme.transitions.duration.leavingScreen;

	if (open) {
		easing = theme.transitions.easing.easeOut;
		duration = theme.transitions.duration.enteringScreen;
	}

	const transition = theme.transitions
		.create('margin', {easing, duration});

	return css`
		transition: ${transition};
	`;
};

const Main = styled('main')<{open: boolean}>`
	${marginTransition}
	flex: 1 1 auto;
	margin-left: -${({theme}) => theme.drawer.width}px;
	padding: ${({theme}) => theme.spacing(3)};

	${({open}) => open && css`
		margin-left: 0
	`};
`;

export default Main;
