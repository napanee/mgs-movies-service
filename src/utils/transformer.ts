import {camelCase} from 'change-case';
import {
	CamelCasedProperties,
	JsonObject,
	SnakeCasedProperties,
} from 'type-fest';


type ReturnType<T> = CamelCasedProperties<T> | Record<string, never>;

function transformKeys<T extends JsonObject>(obj: SnakeCasedProperties<T>): ReturnType<T> {
	return Object.keys(obj).reduce((prev, cur) => ({...prev, [camelCase(cur)]: obj[cur]}), {});
}

export {
	transformKeys,
};
