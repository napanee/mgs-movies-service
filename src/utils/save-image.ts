import {mkdirSync, writeFileSync} from 'fs';
import path from 'path';

import fetch from 'cross-fetch';
import {MD5} from 'crypto-js';

import {MEDIA_ROOT} from '../config';


export const saveImage = async (imagePath: string, detailPath: string) => {
	const destFolder = `${MEDIA_ROOT}/${detailPath}`;
	const md5FileName = MD5(imagePath);
	const ext = path.extname(imagePath);
	const result = await fetch(`https://image.tmdb.org/t/p/original${imagePath}`);

	if (result.status !== 200) {
		return null;
	}

	mkdirSync(destFolder, {recursive: true});

	const data = await result.arrayBuffer();

	writeFileSync(`${destFolder}/${md5FileName}${ext}`, Buffer.from(data));

	return `${detailPath}/${md5FileName}${ext}`;
};
