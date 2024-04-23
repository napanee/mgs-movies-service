import {
	ClassOutlined as IconClassOutlined,
	LocalMoviesOutlined as IconLocalMoviesOutlined,
	PeopleOutlined as IconPeopleOutlined,
	RecordVoiceOverOutlined as IconRecordVoiceOverOutlined,
	SvgIconComponent,
} from '@mui/icons-material';
import {
	Button as MuiButton,
	CardContent as MuiCardContent,
	Grid as MuiGrid,
	Typography as MuiTypography,
} from '@mui/material';
import {Fragment} from 'react';
import {Link} from 'react-router-dom';

import {DashboardQuery, useDashboardQuery} from './query.helper';
import * as S from './styles';


type Items = {
	Icon: SvgIconComponent;
	countData: (data: DashboardQuery) => number | null | undefined;
	label: string;
	routeList: string;
	type: PaletteType;
	routeAdd?: string;
};

const items: Items[] = [
	{
		label: 'Movies',
		Icon: IconLocalMoviesOutlined,
		routeList: '/movies',
		routeAdd: '/movies/add',
		type: 'movie',
		countData: (data: DashboardQuery) => data.movies?.totalCount,
	},
	{
		label: 'Genres',
		Icon: IconClassOutlined,
		routeList: '/genres',
		type: 'genre',
		countData: (data: DashboardQuery) => data.genres?.totalCount,
	},
	{
		label: 'Actors',
		Icon: IconPeopleOutlined,
		routeList: '/actors',
		type: 'actor',
		countData: ({actors: {totalCount}}: DashboardQuery) => totalCount,
	},
	{
		label: 'Directors',
		Icon: IconRecordVoiceOverOutlined,
		routeList: '/directors',
		type: 'director',
		countData: ({directors: {totalCount}}: DashboardQuery) => totalCount,
	},
];


const Dashboard = () => {
	const {loading: isLoading, data} = useDashboardQuery();

	return (
		<Fragment>
			<h1>Dashboard</h1>

			<MuiGrid container spacing={2}>
				{items.map(({label, Icon, routeList, routeAdd, type, countData}) => {
					return (
						<MuiGrid key={type} item xs={3}>
							<S.Card>
								<MuiCardContent>
									<S.Box>
										<S.BoxIcon type={type}><Icon /></S.BoxIcon>
										<S.Box isInner={true}>
											<MuiTypography gutterBottom variant="button">{label}</MuiTypography>
											<MuiTypography variant="h4">
												{!isLoading && data ? countData(data) : 0}
											</MuiTypography>
										</S.Box>
									</S.Box>
									<S.Divider />
									<S.Box>
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
									</S.Box>
								</MuiCardContent>
							</S.Card>
						</MuiGrid>
					);
				})}
			</MuiGrid>
		</Fragment>
	);
};

export default Dashboard;
