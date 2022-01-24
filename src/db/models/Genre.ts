import {
	Association,
	BelongsToManyGetAssociationsMixin,
	BelongsToManyAddAssociationMixin,
	BelongsToManyAddAssociationsMixin,
	BelongsToManyHasAssociationMixin,
	BelongsToManyCountAssociationsMixin,
	BelongsToManyCreateAssociationMixin,
	DataTypes,
	Model,
	ModelAttributes,
	Optional,
	BelongsToManySetAssociationsMixin,
	BelongsToManyRemoveAssociationMixin,
	BelongsToManyRemoveAssociationsMixin,
	BelongsToManyHasAssociationsMixin,
} from 'sequelize';

import Movie from './Movie';

import {sequelizeConnection} from '../connection';


interface GenreAttributes {
	id: string;
	name: string;
	tmdb: number;
}

export interface GenreInput extends Optional<GenreAttributes, 'id'> {}
export interface GenreOuput extends Required<GenreAttributes> {}

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
	tmdb: {
		allowNull: false,
		type: DataTypes.INTEGER,
	},
};

class Genre extends Model<GenreAttributes, GenreInput> implements GenreAttributes {
	declare id: string;
	declare name: string;
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

	declare readonly movies?: Movie[];

	declare static associations: {
		movies: Association<Genre, Movie>;
	};
}

Genre.init(attributes, {sequelize: sequelizeConnection});

export default Genre;
