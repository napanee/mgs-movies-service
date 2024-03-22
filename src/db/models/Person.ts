import {MD5} from 'crypto-js';
import dayjs from 'dayjs';
import {
	Association,
	BelongsToManyAddAssociationMixin,
	BelongsToManyAddAssociationsMixin,
	BelongsToManyCountAssociationsMixin,
	BelongsToManyCreateAssociationMixin,
	BelongsToManyGetAssociationsMixin,
	BelongsToManyHasAssociationMixin,
	BelongsToManyHasAssociationsMixin,
	BelongsToManyRemoveAssociationMixin,
	BelongsToManyRemoveAssociationsMixin,
	BelongsToManySetAssociationsMixin,
	DataTypes,
	Model,
	ModelAttributes,
	Optional,
} from 'sequelize';

import {MEDIA_URL} from '@src/config';
import {saveImage} from '@utils/index';

import Movie from './Movie';

import {sequelizeConnection} from '../connection';


export interface PersonAttributes {
	biography: string | null;
	birthday: string | null;
	deathday: string | null;
	id: number;
	image: string | null;
	imdb: string | null;
	name: string;
	placeOfBirth: string | null;
	tmdb: number;
}

type OptionalAttributes = 'biography'|'birthday'|'deathday'|'id'|'image'|'imdb'|'placeOfBirth';

export type PersonInput = Optional<PersonAttributes, OptionalAttributes>;

const attributes: ModelAttributes = {
	name: {
		allowNull: false,
		type: DataTypes.STRING,
		validate: {
			notEmpty: {
				msg: 'This field cannot be empty.',
			},
		},
	},
	biography: {
		type: DataTypes.TEXT,
	},
	birthday: {
		type: DataTypes.DATEONLY,
	},
	deathday: {
		type: DataTypes.DATEONLY,
	},
	placeOfBirth: {
		type: DataTypes.STRING,
	},
	image: {
		type: DataTypes.STRING,
	},
	imdb: {
		type: DataTypes.STRING,
		validate: {
			notEmpty: {
				msg: 'This field cannot be empty.',
			},
		},
	},
	tmdb: {
		allowNull: false,
		type: DataTypes.INTEGER,
		validate: {
			notEmpty: {
				msg: 'This field cannot be empty.',
			},
		},
	},
	character: {
		type: DataTypes.VIRTUAL,
		get(this: Person): string | undefined {
			return this.movieData?.[0].character;
		},
	},
	imageUrl: {
		type: DataTypes.VIRTUAL,
		get(this: Person): string | null {
			return this.image ? `${MEDIA_URL}${this.image}` : null;
		},
	},
};

const loadImage = async (person: Person) => {
	if (!person.changed('image') || !person.image) {
		return;
	}

	const birthday = dayjs(person.birthday, {format: 'YYYY-MM-DD'});
	const year = birthday.isValid() ? birthday.year() : dayjs().year();
	const hash = MD5(year.toString()).toString().substring(0, 5);
	const prefix = MD5('person').toString().substring(0, 2);
	const image = await saveImage(person.image, `${prefix}/${hash}`);

	person.set('image', image);
};

class Person extends Model<PersonAttributes, PersonInput> implements PersonAttributes {
	declare biography: string | null;
	declare birthday: string | null;
	declare deathday: string | null;
	declare id: number;
	declare image: string | null;
	declare imdb: string | null;
	declare name: string;
	declare placeOfBirth: string | null;
	declare tmdb: number;

	declare readonly createdAt: Date;
	declare readonly updatedAt: Date;

	declare getMovies: BelongsToManyGetAssociationsMixin<Movie>;
	declare setMovies: BelongsToManySetAssociationsMixin<Movie, string>;
	declare addMovies: BelongsToManyAddAssociationsMixin<Movie, string>;
	declare addMovie: BelongsToManyAddAssociationMixin<Movie, string>;
	declare createMovie: BelongsToManyCreateAssociationMixin<Movie>;
	declare removeMovie: BelongsToManyRemoveAssociationMixin<Movie, string>;
	declare removeMovies: BelongsToManyRemoveAssociationsMixin<Movie, string>;
	declare hasMovie: BelongsToManyHasAssociationMixin<Movie, string>;
	declare hasMovies: BelongsToManyHasAssociationsMixin<Movie, string>;
	declare countMovies: BelongsToManyCountAssociationsMixin;

	declare readonly character: string;
	declare readonly filmography: Array<Movie | null>;
	declare readonly imageUrl: string | null;
	declare readonly movieData?: {
		character?: string;
	}[];

	declare static associations: {
		movies: Association<Person, Movie>;
	};
}

Person.init(attributes, {hooks: {beforeSave: loadImage}, sequelize: sequelizeConnection, modelName: 'Person'});

export default Person;
