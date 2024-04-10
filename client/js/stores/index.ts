import {createContext, useContext} from 'react';

import {Modal} from './modal';


export const stores = {
	modalStore: new Modal(),
};

const StoreContext = createContext(stores);

export const {Provider} = StoreContext;

export const useStore = () => useContext(StoreContext);
