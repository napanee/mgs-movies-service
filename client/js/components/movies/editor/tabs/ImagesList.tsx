import {Check as CheckIcon} from '@mui/icons-material';
import {Box, ImageList, ImageListOwnProps} from '@mui/material';

import {MovieImageResultType} from '@utils/themoviedb';

import * as S from './ImagesList.styles';


export enum Type {
	Backdrop = 'backdrop',
	Logo = 'logo',
	Poster = 'poster'
}

type ImagesList = {
	isHidden: boolean;
	onChange: (type: Type, file: string) => void;
	type: Type;
	images?: MovieImageResultType[];
	selectedItem?: string;
};

const ImagesList = ({images, isHidden, selectedItem, type, onChange: handleClick}: ImagesList) => {
	let variant: ImageListOwnProps['variant'] = 'standard';
	let cols: number = 3;

	if (type === Type.Logo) {
		variant = 'masonry';
		cols = 2;
	}

	return (
		<div role="tabpanel" hidden={isHidden} id="vertical-tabpanel-1" aria-labelledby="vertical-tab-1">
			{!isHidden && (
				<Box sx={{p: 3, height: '100%'}} overflow="auto">
					<ImageList sx={{width: '100%'}} cols={cols} gap={10} variant={variant}>
						{Array.isArray(images) && images.map(({filePath}) => (
							<S.ImageListItem
								key={filePath}
								type={type}
								isSelected={selectedItem === filePath}
								onClick={() => handleClick(type, filePath)}
							>
								<img
									src={`https://image.tmdb.org/t/p/original${filePath}`}
									loading="lazy"
								/>

								{selectedItem === filePath && (
									<Box>
										<CheckIcon />
									</Box>
								)}
							</S.ImageListItem>
						))}
					</ImageList>
				</Box>
			)}
		</div>
	);
};

export default ImagesList;
