import {
	ChevronLeft as IconChevronLeft,
	ClassOutlined as IconClassOutlined,
	DashboardOutlined as IconDashboardOutlined,
	LocalMoviesOutlined as IconLocalMoviesOutlined,
	PeopleOutlined as IconPeopleOutlined,
	RecordVoiceOverOutlined as IconRecordVoiceOverOutlined,
} from '@mui/icons-material';
import {
	Divider as MuiDivider,
	IconButton as MuiIconButton,
	List as MuiList,
	ListItemButton as MuiListItemButton,
	ListItemIcon as MuiListItemIcon,
	ListItemText as MuiListItemText,
} from '@mui/material';
import {NavLink} from 'react-router-dom';

import * as BaseS from '@components/styles';

import * as S from './styles';


type SidebarProps = {
	isOpen: boolean;
	toggleDrawer: () => void;
};

const Sidebar = ({isOpen, toggleDrawer: handleClick}: SidebarProps) => {
	return (
		<S.Drawer variant="persistent" anchor="left" open={isOpen}>
			<BaseS.DrawerHeader>
				<MuiIconButton onClick={handleClick}>
					<IconChevronLeft />
				</MuiIconButton>
			</BaseS.DrawerHeader>
			<MuiDivider />
			<MuiList>
				<MuiListItemButton component={NavLink} to="/">
					<MuiListItemIcon><IconDashboardOutlined /></MuiListItemIcon>
					<MuiListItemText primary="Dashboard" />
				</MuiListItemButton>
				<MuiListItemButton component={NavLink} to="/movies">
					<MuiListItemIcon><IconLocalMoviesOutlined /></MuiListItemIcon>
					<MuiListItemText primary="Movies" />
				</MuiListItemButton>
				<MuiListItemButton component={NavLink} to="/genres">
					<MuiListItemIcon><IconClassOutlined /></MuiListItemIcon>
					<MuiListItemText primary="Genres" />
				</MuiListItemButton>
				<MuiListItemButton component={NavLink} to="/actors">
					<MuiListItemIcon><IconPeopleOutlined /></MuiListItemIcon>
					<MuiListItemText primary="Actors" />
				</MuiListItemButton>
				<MuiListItemButton component={NavLink} to="/directors">
					<MuiListItemIcon><IconRecordVoiceOverOutlined /></MuiListItemIcon>
					<MuiListItemText primary="Directors" />
				</MuiListItemButton>
			</MuiList>
		</S.Drawer>
	);
};

export default Sidebar;
