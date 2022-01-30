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
	Optional
} from 'sequelize';
import { MoviePeople } from '.';

import {saveImage} from '../../utils';
import {sequelizeConnection} from '../connection';

import Movie from './Movie';


interface PersonAttributes {
	id: string;
	name: string;
	imdb: string;
	tmdb: number;
	biography?: string;
	birthday?: string | null;
	deathday?: string | null;
	placeOfBirth?: string | null;
	image?: string | null;
	Movies?: Movie[];
}

export interface PersonInput extends Optional<PersonAttributes, 'id'|'tmdb'> {}
export interface PersonOuput extends Required<PersonAttributes> {}

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
		type: DataTypes.INTEGER,
		validate: {
			notEmpty: {
				msg: 'This field cannot be empty.',
			},
		},
	},
};

const loadImages = async (person: Person) => {
	if (!person.isNewRecord || !person.image) {
		return
	}

	const birthday = dayjs(person.birthday, {format: 'YYYY-MM-DD'});
	const year = birthday.isValid() ? birthday.year() : dayjs().year();
	const hash = MD5(year.toString()).toString().substring(0, 5);
	const prefix = MD5('person').toString().substring(0, 2);
	const image = await saveImage(person.image, `${prefix}/${hash}`);
	person.set('image', image);
};

class Person extends Model<PersonAttributes, PersonInput> implements PersonAttributes {
	declare id: string;
	declare name: string;
	declare imdb: string;
	declare tmdb: number;
	declare biography?: string;
	declare birthday?: string | null;
	declare deathday?: string | null;
	declare placeOfBirth?: string | null;
	declare image?: string;

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

	declare readonly Movies?: Movie[];
	declare readonly MoviePeople?: MoviePeople;

	declare static associations: {
		Movies: Association<Person, Movie>;
	};

	public toJSON(): object {
		return super.toJSON();
	}
}

Person.init(attributes, {hooks: {beforeCreate: loadImages}, sequelize: sequelizeConnection});

export default Person;
