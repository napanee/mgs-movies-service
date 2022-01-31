import {IncludeOptions} from "sequelize";


export function instanceOfIncludeOptions(data: any): data is IncludeOptions {
	return 'model' in data && 'where' in data;
}
