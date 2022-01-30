import * as changeCase from 'change-case';
import {CamelCasedProperties, JsonObject, KebabCasedProperties, PascalCasedProperties, SnakeCasedProperties} from 'type-fest';


enum Transformer {
	'camelCase',
	'capitalCase',
	'paramCase'
}

function transformKeys<T extends JsonObject>(obj: SnakeCasedProperties<T>, transformer?: 'camelCase'): CamelCasedProperties<T>;
function transformKeys<T extends JsonObject>(obj: PascalCasedProperties<T>, transformer?: 'capitalCase'): PascalCasedProperties<T>;
function transformKeys<T extends JsonObject>(obj: SnakeCasedProperties<T>, transformer?: 'paramCase'): KebabCasedProperties<T>;
function transformKeys<T extends JsonObject>(obj: SnakeCasedProperties<T>, transformer: keyof typeof Transformer = 'camelCase'): CamelCasedProperties<T> | KebabCasedProperties<T> | {} {
	return Object.keys(obj).reduce((prev, cur, i) => ({...prev, [changeCase[transformer](cur)]: obj[cur]}), {});
}

export {
	transformKeys,
};
