import {Dialect} from 'sequelize';


declare global {
	namespace NodeJS {
		interface ProcessEnv {
			DATABASE_DIALECT: Dialect;
			DATABASE_HOST: string;
			DATABASE_NAME: string;
			DATABASE_PASS: string;
			DATABASE_PORT: number;
			DATABASE_USER: string;
			DEBUG: boolean;
			NODE_ENV: 'development' | 'test' | 'production';
		}
	}
}

export {};
