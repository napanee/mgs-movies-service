import {FindOptions, IncludeOptions} from "sequelize";


export function instanceOfIncludeOptions(data: any): data is IncludeOptions {
	return 'model' in data && 'where' in data;
}

export function instanceOfFindOptions(data: any): data is FindOptions {
	return 'include' in data || 'order' in data;
}
