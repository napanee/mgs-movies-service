import {Card, CardContent, CardMedia, Grid, Paper, Typography} from '@mui/material';

import Editor from '@components/movies/editor/Editor';
import {useStore} from '@stores/index';

import {MovieNodeFragment} from './fragment.helper';
import * as S from './styles';


type ItemProps = {
	movie: MovieNodeFragment;
};

const Item = ({movie}: ItemProps) => {
	const {modalStore} = useStore();
	const handleClick = () => {
		modalStore.open(<Editor id={movie.id} tmdb={movie.tmdb} />);
	};
	const imageUrl = movie.backdropUrl || movie.posterUrl;

	return (
		<Grid item xs={12} sm={6} md={4} lg={4} xl={2} onClick={handleClick}>
			<Card>
				<S.Box>
					{imageUrl ? (
						<CardMedia
							component="img"
							height="200"
							image={imageUrl}
							alt={movie.title}
						/>
					) : (
						<Paper elevation={0} style={{height: '200px'}} />
					)}
					{movie.logoUrl && (
						<CardMedia component="img" className="logo" image={movie.logoUrl} alt={`${movie.title} Logo`} />
					)}
				</S.Box>
				<CardContent>
					<Typography gutterBottom variant="body1" component="div">{movie.title}</Typography>
				</CardContent>
			</Card>
		</Grid>
	);
};

export default Item;
