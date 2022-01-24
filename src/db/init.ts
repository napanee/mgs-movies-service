import {sequelizeConnection} from './connection';


const isDev = process.env.NODE_ENV === 'development'

const dbInit = () => {
	sequelizeConnection.sync({alter: isDev});
}

export default dbInit
