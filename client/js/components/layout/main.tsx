import styled, {DefaultTheme} from 'styled-components';

import {drawerWidth} from '@utils/constants';


type MainProps = {
	open: boolean;
	theme: DefaultTheme;
};

const marginTransition = ({open, theme}: MainProps) => {
	let easing = theme.transitions.easing.sharp;
	let duration = theme.transitions.duration.leavingScreen;

	if (open) {
		easing = theme.transitions.easing.easeOut;
		duration = theme.transitions.duration.enteringScreen;
	}

	const transition = theme.transitions.create('margin', {easing, duration});

	return `transition: ${transition};`;
};

const Main = styled.main`
	${marginTransition}
	flex: 1 1 auto;
	margin-left: -${drawerWidth}px;
	padding: ${({theme}) => theme.spacing(3)};
	${({open}) => open && 'margin-left: 0'};
`;

export default Main;
