import {FC, ReactElement} from 'react';
import styled from 'styled-components';


const Title = styled.h1`
	position: relative;
	color: ${({theme}) => theme.palette.error.main};
	font-size: 1.5em;
	text-align: center;
`;

const app: FC = (): ReactElement => {
	return (
		<Title>Start</Title>
	);
};

export default app;
