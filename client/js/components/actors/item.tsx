import {
	Card as MuiCard,
	CardContent as MuiCardContent,
	CardMedia as MuiCardMedia,
	Grid as MuiGrid,
	Paper as MuiPaper,
	Typography as MuiTypography,
} from '@mui/material';


type ItemProps = {
	data: {
		imageUrl: string;
		name: string;
	};
};

const Item = ({data}: ItemProps) => {
	return (
		<MuiGrid item xs={12} sm={6} md={3} lg={2} xl={1}>
			<MuiCard>
				{data.imageUrl ? (
					<MuiCardMedia component="img" height="300" image={data.imageUrl} alt="green iguana" />
				) : (
					<MuiPaper elevation={0} style={{height: '300px'}} />
				)}
				<MuiCardContent>
					<MuiTypography gutterBottom variant="body1" component="div">{data.name}</MuiTypography>
				</MuiCardContent>
			</MuiCard>
		</MuiGrid>
	);
};

export default Item;
