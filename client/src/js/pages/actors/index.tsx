import {Grid as MuiGrid} from '@mui/material';
import {ChangeEvent, Fragment} from 'react';

import Item from '@components/actors/item';
import {Pagination} from '@generic/index';
import {useLocationQuery} from '@hooks/useLocationQuery';

import {useActorsQuery} from './query.helper';


const PAGE_COUNT = 60;

const Actors = () => {
	const locationQuery = useLocationQuery();
	const page = parseInt(locationQuery.get('page') || '1', 10);
	const {loading: isLoading, data, fetchMore} = useActorsQuery({
		fetchPolicy: 'cache-first',
		variables: {
			limit: PAGE_COUNT,
			offset: (page - 1) * PAGE_COUNT,
		},
	});
	const count = Math.ceil((data?.actors.totalCount || 1) / PAGE_COUNT);
	const items = data?.actors.edges.map(({node}) => (<Item key={node.id} actor={node} />));

	const onChange = (_: ChangeEvent, page: number) => {
		const offset = (page - 1) * PAGE_COUNT;

		fetchMore({variables: {offset}});
	};

	return (
		<Fragment>
			<h1>Actors</h1>

			<MuiGrid container spacing={2} mb={2}>
				{!isLoading && items}
			</MuiGrid>

			<MuiGrid container justifyContent="center">
				<Pagination count={count} page={page} path="/actors" onChange={onChange} />
			</MuiGrid>
		</Fragment>
	);
};

export default Actors;
