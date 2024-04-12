import {ImageListItemProps, ImageListItem as MuiImageListItem, css, styled} from '@mui/material';

import {Type} from './ImagesList';


interface StyledImageListItemProps extends ImageListItemProps {
	type: Type;
	isSelected?: boolean;
}

const shouldForwardProp = (prop: PropertyKey) => {
	return !['isSelected', 'type'].includes(prop.toString());
};

export const ImageListItem = styled(MuiImageListItem, {shouldForwardProp})<StyledImageListItemProps>`
	cursor: pointer;

	${({theme, type}) => {
		switch (type) {
			case Type.Backdrop:
			case Type.Poster:
				return css`
					border: 2px solid ${theme.palette.grey[800]};

					&:hover {
						border-color: ${theme.palette.warning.light};
					}
				`;
			case Type.Logo:
				return css`
					display: flex;
					align-items: center;
					padding: 5px;
					min-height: 50px;
					border: 2px solid ${theme.palette.grey[800]};

					&:hover {
						background-color: ${theme.palette.grey[800]};
						border-color: ${theme.palette.warning.light};
					}
				`;
		}
	}}

	${({isSelected, theme}) => isSelected && css`
		border-color: ${theme.palette.warning.light};
	`}

	> div {
		position: absolute;
		top: 0;
		right: 0;
		line-height: 0;

		${({theme}) => css`
			z-index: ${theme.zIndex.base};
			color: ${theme.palette.primary.contrastText};
		`}

		&::before {
			content: '';
			position: absolute;
			top: 0;
			right: 0;
			width: 0;
			height: 0;

			${({theme}) => css`
				z-index: ${theme.zIndex.background};
				border: 22px solid ${theme.palette.warning.light};
				border-bottom-color: transparent;
				border-left-color: transparent;
			`}
		}
	}
`;
