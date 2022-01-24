import {Dialect} from 'sequelize';


declare global {
	namespace NodeJS {
		interface ProcessEnv {
			DATABASE_NAME: string;
			DATABASE_DIALECT: Dialect;
			DATABASE_HOST: string;
			NODE_ENV: 'development' | 'production';
			DATABASE_PASS: string;
			DATABASE_PORT: number;
			DATABASE_USER: string;
		}
	}
}

export {}
