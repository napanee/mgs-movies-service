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

import Genre from './Genre';
import MoviePeople from './MoviePeople';
import Person from './Person';

import {saveImage} from '../../utils';
import {sequelizeConnection} from '../connection';


interface MovieAttributes {
	id: string;
	imdb: string;
	releaseDate: string;
	title: string;
	titleOriginal: string;
	tmdb: number;
	backdrop?: string | null;
	character?: string;
	overview?: string | null;
	poster?: string | null;
	runtime?: number | null;
}

export type MovieInput = Optional<MovieAttributes, 'id'|'tmdb'>;
export type MovieOutput = Optional<MovieAttributes, 'runtime'|'overview'|'backdrop'|'poster'>;

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
	character: {
		type: DataTypes.VIRTUAL,
		get(this: Movie): string | undefined {
		  return this.People?.[0].MoviePeople?.character;
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
	declare readonly MoviePeople?: MoviePeople;

	declare static associations: {
		Genres: Association<Movie, Genre>;
		People: Association<Movie, Person>;
	};
}

Movie.init(attributes, {hooks: {beforeCreate: loadImages, beforeUpdate: loadImages}, sequelize: sequelizeConnection});

export default Movie;
