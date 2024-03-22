import {join} from 'path';


const ROOT_DIR = __dirname.replace(/\/src\/config|\/build/g, '');
const STATIC_ROOT = join(ROOT_DIR, 'build', 'static');
const STATIC_URL = '/static/';

export {
	STATIC_ROOT,
	STATIC_URL,
};
