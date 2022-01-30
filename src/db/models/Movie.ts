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

import {saveImage} from '../../utils';
import {sequelizeConnection} from '../connection';

import Genre from './Genre';
import Person from './Person';


interface MovieAttributes {
	id: string;
	title: string;
	titleOriginal: string;
	releaseDate: string;
	imdb: string;
	tmdb: number;
	runtime?: number | null;
	overview?: string | null;
	backdrop?: string | null;
	poster?: string | null;
}

export interface MovieInput extends Optional<MovieAttributes, 'id'|'tmdb'> {}
export interface MovieOuput extends Required<MovieAttributes> {}

const attributes: ModelAttributes = {
	title: {
		allowNull: false,
		type: DataTypes.STRING,
		validate: {
			notEmpty: {
				msg: 'This field cannot be empty.',
			},
		},
	},
	titleOriginal: {
		allowNull: false,
		type: DataTypes.STRING,
		validate: {
			notEmpty: {
				msg: 'This field cannot be empty.',
			},
		},
	},
	runtime: {
		allowNull: false,
		type: DataTypes.INTEGER,
		validate: {
			notEmpty: {
				msg: 'This field cannot be empty.',
			},
		},
	},
	releaseDate: {
		allowNull: false,
		type: DataTypes.DATEONLY,
		validate: {
			notEmpty: {
				msg: 'This field cannot be empty.',
			},
		},
	},
	overview: {
		allowNull: false,
		type: DataTypes.TEXT,
	},
	backdrop: {
		type: DataTypes.STRING,
	},
	poster: {
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

const loadImages = async (movie: Movie) => {
	const year = dayjs(movie.releaseDate, {format: 'YYYY-MM-DD'}).year();
	const hash = MD5(year.toString()).toString().substring(0, 5);

	if (movie.changed('backdrop') && movie.backdrop) {
		const prefix = MD5('movie/backdrop').toString().substring(0, 2);
		const backdrop = await saveImage(movie.backdrop, `${prefix}/${hash}`);
		movie.set('backdrop', backdrop);
	}

	if (movie.changed('poster') && movie.poster) {
		const prefix = MD5('movie/poster').toString().substring(0, 2);
		const poster = await saveImage(movie.poster, `${prefix}/${hash}`);
		movie.set('poster', poster);
	}
};

class Movie extends Model<MovieAttributes, MovieInput> implements MovieAttributes {
	declare id: string;
	declare title: string;
	declare titleOriginal: string;
	declare releaseDate: string;
	declare imdb: string;
	declare tmdb: number;
	declare runtime?: number | null;
	declare overview?: string | null;
	declare backdrop?: string | null;
	declare poster?: string | null;

	declare readonly createdAt: Date;
	declare readonly updatedAt: Date;

	declare getGenres: BelongsToManyGetAssociationsMixin<Genre>;
	declare setGenres: BelongsToManySetAssociationsMixin<Genre, string>;
	declare addGenres: BelongsToManyAddAssociationsMixin<Genre, string>;
	declare addGenre: BelongsToManyAddAssociationMixin<Genre, string>;
	declare createGenre: BelongsToManyCreateAssociationMixin<Genre>;
	declare removeGenre: BelongsToManyRemoveAssociationMixin<Genre, string>;
	declare removeGenres: BelongsToManyRemoveAssociationsMixin<Genre, string>;
	declare hasGenre: BelongsToManyHasAssociationMixin<Genre, string>;
	declare hasGenres: BelongsToManyHasAssociationsMixin<Genre, string>;
	declare countGenres: BelongsToManyCountAssociationsMixin;

	declare getPeople: BelongsToManyGetAssociationsMixin<Person>;
	declare setPeople: BelongsToManySetAssociationsMixin<Person, string>;
	declare addPeople: BelongsToManyAddAssociationsMixin<Person, string>;
	declare addPerson: BelongsToManyAddAssociationMixin<Person, string>;
	declare createPerson: BelongsToManyCreateAssociationMixin<Person>;
	declare removePerson: BelongsToManyRemoveAssociationMixin<Person, string>;
	declare removePeople: BelongsToManyRemoveAssociationsMixin<Person, string>;
	declare hasPerson: BelongsToManyHasAssociationMixin<Person, string>;
	declare hasPeople: BelongsToManyHasAssociationsMixin<Person, string>;
	declare countPeople: BelongsToManyCountAssociationsMixin;

	declare readonly Genres?: Genre[];
	declare readonly People?: Person[];

	declare static associations: {
		Genres: Association<Movie, Genre>;
		People: Association<Movie, Person>;
	};
}

Movie.init(attributes, {hooks: {beforeCreate: loadImages, beforeUpdate: loadImages}, sequelize: sequelizeConnection});

export default Movie;
