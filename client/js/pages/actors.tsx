import {gql, useQuery} from '@apollo/client';
import {Grid as MuiGrid} from '@mui/material';
import {ChangeEvent, Fragment} from 'react';

import Item from '@components/actors/item';
import {useLocationQuery} from '@hooks/useLocationQuery';

import Pagination from '../generic/pagination/Pagination';


type QueryData = {
	actors: {
		edges: {
			node: {
				id: number;
				imageUrl: string;
				name: string;
			};
		}[];
		pageInfo: {
			hasNextPage: boolean;
			hasPreviousPage: boolean;
		};
		totalCount: number;
	};
};

const PAGE_COUNT = 60;
const QueryActors = gql`
	query actors($limit: Int, $offset: Int) {
		actors(limit: $limit, offset: $offset) @connection(key: "actors") {
			edges {
				node {
					id
					imageUrl
					name
				}
			}
			totalCount
		}
	}
`;

const Actors = () => {
	const locationQuery = useLocationQuery();
	const page = parseInt(locationQuery.get('page') || '1', 10);
	const {loading: isLoading, data, fetchMore} = useQuery<QueryData>(QueryActors, {
		fetchPolicy: 'cache-first',
		variables: {
			limit: PAGE_COUNT,
			offset: (page - 1) * PAGE_COUNT,
		},
	});
	const count = Math.ceil((data?.actors.totalCount || 1) / PAGE_COUNT);
	const items = data?.actors.edges.map(({node: data}) => (<Item key={data.id} data={data} />));

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
