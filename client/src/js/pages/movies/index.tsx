import {Grid} from '@mui/material';
import {ChangeEvent} from 'react';

import Item from '@components/movies/item';
import {Pagination} from '@generic/index';
import {useLocationQuery} from '@hooks/useLocationQuery';

import {useGetMoviesQuery} from './query.helper';


const PAGE_COUNT = 48;

const Movies = () => {
	const locationQuery = useLocationQuery();
	const page = parseInt(locationQuery.get('page') || '1', 10);
	const {loading: isLoading, data, fetchMore} = useGetMoviesQuery({
		fetchPolicy: 'cache-first',
		variables: {
			limit: PAGE_COUNT,
			offset: (page - 1) * PAGE_COUNT,
		},
	});
	const count = Math.ceil((data?.movies.totalCount || 1) / PAGE_COUNT);
	const items = data?.movies.edges.map(({node}) => (<Item key={node.id} movie={node} />));

	const onChange = (_: ChangeEvent, page: number) => {
		const offset = (page - 1) * PAGE_COUNT;

		fetchMore({variables: {offset}});
	};

	return (
		<>
			<h1>Movies</h1>

			<Grid container spacing={2} mb={2}>
				{!isLoading && items}
			</Grid>

			<Grid container justifyContent="center">
				<Pagination count={count} page={page} path="/movies" onChange={onChange} />
			</Grid>
		</>
	);
};

export default Movies;
