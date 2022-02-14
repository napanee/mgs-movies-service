import {Pagination, PaginationItem, PaginationRenderItemParams} from '@mui/material';
import {ChangeEvent} from 'react';
import {Link as RouterLink} from 'react-router-dom';


type CustomPaginationProps = {
	count: number;
	onChange: (event: ChangeEvent, page: number) => void;
	page: number;
	path: string;
};

const paginationItem = (item: PaginationRenderItemParams, path: string) => {
	switch (item.type) {
		case 'page':
		case 'first':
		case 'last':
		case 'next':
		case 'previous': {
			return (<PaginationItem {...item} component={RouterLink} to={`${path}?page=${item.page}`} />);
		}
		default:
			return (<PaginationItem {...item} />);
	}
};

const CustomPagination = ({count, page, path, onChange}: CustomPaginationProps) => {
	return (
		<Pagination
			color="primary"
			count={count}
			page={page}
			renderItem={(item: PaginationRenderItemParams) => paginationItem(item, path)}
			shape="rounded"
			showFirstButton
			showLastButton
			variant="outlined"
			onChange={onChange}
		/>
	);
};

export default CustomPagination;
