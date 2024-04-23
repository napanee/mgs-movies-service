import {Box} from '@mui/material';


const General = ({isHidden}: {isHidden: boolean}) => {
	return (
		<div role="tabpanel" hidden={isHidden} id="vertical-tabpanel-0" aria-labelledby="vertical-tab-0">
			{!isHidden && (<Box sx={{p: 3}}>BOX 0</Box>)}
		</div>
	);
};

export default General;
