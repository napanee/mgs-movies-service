import {join} from 'path';


const ROOT_DIR = __dirname.replace(/\/server\/src|\/dist\/src/g, '');
const MEDIA_ROOT = join(ROOT_DIR, 'web', 'media');
const MEDIA_URL = '/media/';
const STATIC_ROOT = join(ROOT_DIR, 'dist', 'static');
const STATIC_URL = '/static/';

export {
	MEDIA_ROOT,
	MEDIA_URL,
	STATIC_ROOT,
	STATIC_URL,
};
