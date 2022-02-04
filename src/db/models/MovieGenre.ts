import {DataTypes, Model, ModelAttributes} from 'sequelize';

import Genre from './Genre';
import Movie from './Movie';

import {sequelizeConnection} from '../connection';


interface MovieGenreAttributes {
	genreId: string;
	movieId: string;
}

export type MovieGenreInput = Required<MovieGenreAttributes>;
export type MovieGenreOutput = Required<MovieGenreAttributes>;

const attributes: ModelAttributes = {
	movieId: {
		allowNull: false,
		type: DataTypes.UUID,
	},
	genreId: {
		allowNull: false,
		type: DataTypes.UUID,
	},
};

class MovieGenre extends Model<MovieGenreAttributes, MovieGenreInput> implements MovieGenreAttributes {
	declare movieId: string;
	declare genreId: string;

	declare readonly createdAt: Date;
	declare readonly updatedAt: Date;
}

MovieGenre.init(attributes, {sequelize: sequelizeConnection});
Movie.belongsToMany(Genre, {through: MovieGenre, foreignKey: 'movieId', otherKey: 'genreId'});
Genre.belongsToMany(Movie, {through: MovieGenre, foreignKey: 'genreId', otherKey: 'movieId'});

export default MovieGenre;
