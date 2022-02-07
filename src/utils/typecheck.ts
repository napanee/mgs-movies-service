import {FindOptions, IncludeOptions} from 'sequelize';


export function instanceOfIncludeOptions(data: IncludeOptions | Record<string, unknown>): data is IncludeOptions {
	return 'model' in data && 'where' in data;
}

export function instanceOfFindOptions(data: FindOptions | Record<string, unknown>): data is FindOptions {
	return 'include' in data || 'order' in data;
}
