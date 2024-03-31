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

import {saveImage} from '@utils/index';

import Genre from './Genre';
import Person from './Person';

import {sequelizeConnection} from '../connection';


export interface MovieAttributes {
	backdrop: string | null;
	id: number;
	imdb: string;
	logo: string | null;
	overview: string | null;
	poster: string | null;
	releaseDate: string;
	runtime: number | null;
	title: string;
	titleOriginal: string;
	tmdb: number;
}

type OptionalAttributes = 'backdrop'|'id'|'logo'|'overview'|'poster'|'runtime';

export type MovieInput = Optional<MovieAttributes, OptionalAttributes>;

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
		type: DataTypes.TEXT,
	},
	backdrop: {
		type: DataTypes.STRING,
	},
	poster: {
		type: DataTypes.STRING,
	},
	logo: {
		type: DataTypes.STRING,
	},
	imdb: {
		allowNull: false,
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
		get(this: Movie): string | undefined {
			return this.MoviePeople?.character;
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

	if (movie.changed('logo') && movie.logo) {
		const prefix = MD5('movie/logo').toString().substring(0, 2);
		const logo = await saveImage(movie.logo, `${prefix}/${hash}`);

		movie.set('logo', logo);
	}

	if (movie.changed('poster') && movie.poster) {
		const prefix = MD5('movie/poster').toString().substring(0, 2);
		const poster = await saveImage(movie.poster, `${prefix}/${hash}`);

		movie.set('poster', poster);
	}
};

class Movie extends Model<MovieAttributes, MovieInput> implements MovieAttributes {
	declare backdrop: string | null;
	declare id: number;
	declare imdb: string;
	declare logo: string | null;
	declare overview: string | null;
	declare poster: string | null;
	declare releaseDate: string;
	declare runtime: number | null;
	declare title: string;
	declare titleOriginal: string;
	declare tmdb: number;

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

	declare readonly Genres?: Array<Genre>;
	declare readonly MoviePeople?: {
		character?: string;
	};
	declare readonly People?: Array<Person>;
	declare readonly character: string;

	declare static associations: {
		Genres: Association<Movie, Genre>;
		People: Association<Movie, Person>;
	};
}

Movie.init(attributes, {hooks: {beforeSave: loadImages}, sequelize: sequelizeConnection, modelName: 'Movie'});

export default Movie;
