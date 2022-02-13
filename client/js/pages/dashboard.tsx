import {gql, useQuery} from '@apollo/client';
import {
	ClassOutlined as IconClassOutlined,
	LocalMoviesOutlined as IconLocalMoviesOutlined,
	PeopleOutlined as IconPeopleOutlined,
	RecordVoiceOverOutlined as IconRecordVoiceOverOutlined,
	SvgIconComponent,
} from '@mui/icons-material';
import {
	Box as MuiBox,
	Button as MuiButton,
	Card as MuiCard,
	CardContent as MuiCardContent,
	Divider as MuiDivider,
	Grid as MuiGrid,
	Typography as MuiTypography,
} from '@mui/material';
import {Fragment} from 'react';
import {Link} from 'react-router-dom';
import styled, {DefaultTheme} from 'styled-components';

import {PaletteType} from '../theme';


type QueryData = {
	actors: {
		totalCount: number;
	};
	directors: {
		totalCount: number;
	};
	genres: {
		totalCount: number;
	};
	movies: {
		totalCount: number;
	};
};

type Items = {
	Icon: SvgIconComponent;
	countData: (data: QueryData) => number;
	label: string;
	routeList: string;
	type: PaletteType;
	routeAdd?: string;
};

const GET_COUNTS = gql`
	query {
		actors {
			totalCount
		}
		directors {
			totalCount
		}
		genres {
			totalCount
		}
		movies {
			totalCount
		}
	}
`;

const Divider = styled(MuiDivider)`
	margin: ${({theme}) => theme.spacing(2, 0)};
	height: 1px;
	background-image: linear-gradient(to right, rgba(52, 71, 103, 0), rgba(52, 71, 103, 0.4), rgba(52, 71, 103, 0));
	border: 0;
`;

const Card = styled(MuiCard)`
	overflow: visible;
	height: 100%;
`;

const Box = styled(MuiBox)`
	display: flex;
	align-items: flex-start;
	justify-content: space-between;
	${({isInner}: {isInner?: boolean}) => isInner && 'flex-direction: column; align-items: flex-end;'}
`;

const BoxIcon = styled(MuiBox)`
	transform: translateY(-50%);
	padding: ${({theme}) => theme.spacing(1.5)};
	background: ${({theme, type}: {theme: DefaultTheme; type: PaletteType}) =>
		`linear-gradient(to bottom right, ${theme.palette.type[type].dark}, ${theme.palette.type[type].light})`};
	border-radius: ${({theme}) => `${theme.shape.borderRadius}px`};

	svg {
		display: block;
	}
`;

const items: Items[] = [
	{
		label: 'Movies',
		Icon: IconLocalMoviesOutlined,
		routeList: '/movies',
		routeAdd: '/movies/add',
		type: 'movie',
		countData: ({movies: {totalCount}}: QueryData) => totalCount,
	},
	{
		label: 'Genres',
		Icon: IconClassOutlined,
		routeList: '/genres',
		type: 'genre',
		countData: ({genres: {totalCount}}: QueryData) => totalCount,
	},
	{
		label: 'Actors',
		Icon: IconPeopleOutlined,
		routeList: '/actors',
		type: 'actor',
		countData: ({actors: {totalCount}}: QueryData) => totalCount,
	},
	{
		label: 'Directors',
		Icon: IconRecordVoiceOverOutlined,
		routeList: '/directors',
		type: 'director',
		countData: ({directors: {totalCount}}: QueryData) => totalCount,
	},
];


const Dashboard = () => {
	const {loading: isLoading, data} = useQuery<QueryData>(GET_COUNTS);

	return (
		<Fragment>
			<h1>Dashboard</h1>

			<MuiGrid container spacing={2}>
				{items.map(({label, Icon, routeList, routeAdd, type, countData}) => {
					return (
						<MuiGrid key={type} item xs={3}>
							<Card>
								<MuiCardContent>
									<Box>
										<BoxIcon type={type}><Icon /></BoxIcon>
										<Box isInner={true}>
											<MuiTypography gutterBottom variant="button">{label}</MuiTypography>
											<MuiTypography variant="h4">
												{!isLoading && data ? countData(data) : 0}
											</MuiTypography>
										</Box>
									</Box>
									<Divider />
									<Box>
										{routeList && (
											<MuiButton component={Link} to={routeList} variant="outlined" size="small">
												List
											</MuiButton>
										)}
										{routeAdd && (
											<MuiButton component={Link} to={routeAdd} variant="outlined" size="small">
												Add
											</MuiButton>
										)}
									</Box>
								</MuiCardContent>
							</Card>
						</MuiGrid>
					);
				})}
			</MuiGrid>
		</Fragment>
	);
};

export default Dashboard;
