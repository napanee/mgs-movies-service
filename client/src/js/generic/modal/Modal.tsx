import {Modal as MuiModal} from '@mui/material';
import {observer} from 'mobx-react-lite';

import {useStore} from '@stores/index';

import * as S from './styles';


const Modal = () => {
	const {modalStore} = useStore();
	const handleClose = () => {
		modalStore.close();
	};

	return (
		<MuiModal
			open={modalStore.isOpen}
			onClose={handleClose}
			aria-labelledby="child-modal-title"
			aria-describedby="child-modal-description"
		>
			<S.Content>
				{modalStore.content}
			</S.Content>
		</MuiModal>
	);
};

export default observer(Modal);
