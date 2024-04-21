import {
	DocumentScannerOutlined as DocumentIcon,
	ImageOutlined as ImageIcon,
} from '@mui/icons-material';
import {Box, Button} from '@mui/material';
import {useEffect, useState} from 'react';

import {useStore} from '@stores/index';

// eslint-disable-next-line import/order
import {MovieImagesResultType, fetchImages} from '@utils/themoviedb';

import {useMovieMutation} from './mutation.helper';
import * as S from './styles';
import {General, ImagesList} from './tabs';
import {Type} from './tabs/ImagesList';


const Editor = ({id, tmdb}: {id: number; tmdb: number}) => {
	const [value, setValue] = useState(0);
	const [images, setImages] = useState<MovieImagesResultType>();
	const [selectedImages, setSelectedImages] = useState<{[key in Type]?: string}>({});
	const [movieMutation] = useMovieMutation();
	const {modalStore} = useStore();

	useEffect(() => {
		if (images) {
			return;
		}

		fetchImages(tmdb).then((images) => {
			setImages(images);
		});
	}, []);

	const handleChange = (event: React.SyntheticEvent, newValue: number) => {
		setValue(newValue);
	};

	const handleImageChange = (type: Type, image: string) => {
		setSelectedImages({
			...selectedImages,
			[type]: image,
		});
	};

	const handleCancel = () => {
		modalStore.close();
	};

	const handleSave = () => {
		movieMutation({
			variables: {
				id,
				input: selectedImages,
			},
			refetchQueries: ['getMovies'],
			onCompleted() {
				modalStore.close();
			},
		});
	};

	function a11yProps(index: number) {
		return {
			id: `vertical-tab-${index}`,
			'aria-controls': `vertical-tabpanel-${index}`,
		};
	}

	return (
		<>
			<Box sx={{flexGrow: 1, bgcolor: 'background.paper', display: 'flex', minHeight: 300}}>
				<S.Tabs
					orientation="vertical"
					variant="scrollable"
					value={value}
					onChange={handleChange}
					aria-label="Vertical tabs example"
					sx={{borderRight: 1, borderColor: 'divider'}}
				>
					<S.Tab icon={<DocumentIcon />} iconPosition='start' label="General" {...a11yProps(0)} />
					<S.Tab icon={<ImageIcon />} iconPosition='start' label="Backdrop" {...a11yProps(1)} />
					<S.Tab icon={<ImageIcon />} iconPosition='start' label="Logo" {...a11yProps(2)} />
					<S.Tab icon={<ImageIcon />} iconPosition='start' label="Poster" {...a11yProps(3)} />
				</S.Tabs>
				<General isHidden={value !== 0} />
				<ImagesList
					isHidden={value !== 1}
					images={images?.backdrops}
					selectedItem={selectedImages[Type.Backdrop]}
					type={Type.Backdrop}
					onChange={handleImageChange}
				/>
				<ImagesList
					isHidden={value !== 2}
					images={images?.logos}
					selectedItem={selectedImages[Type.Logo]}
					type={Type.Logo}
					onChange={handleImageChange}
				/>
				<ImagesList
					isHidden={value !== 3}
					images={images?.posters}
					selectedItem={selectedImages[Type.Poster]}
					type={Type.Poster}
					onChange={handleImageChange}
				/>
			</Box>
			<S.Bottom padding={1}>
				<Button variant="contained" color="warning" onClick={handleCancel}>Cancel</Button>
				<Button variant="contained" color="info" onClick={handleSave}>Save</Button>
			</S.Bottom>
		</>
	);
};

export default Editor;
