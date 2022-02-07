import {DataTypes, Model, ModelAttributes} from 'sequelize';

import Genre from './Genre';
import Movie from './Movie';

import {sequelizeConnection} from '../connection';


interface MovieGenresAttributes {
	genreId: string;
	movieId: string;
}

export type MovieGenresInput = Required<MovieGenresAttributes>;
export type MovieGenresOutput = Required<MovieGenresAttributes>;

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

class MovieGenres extends Model<MovieGenresAttributes, MovieGenresInput> implements MovieGenresAttributes {
	declare movieId: string;
	declare genreId: string;

	declare readonly createdAt: Date;
	declare readonly updatedAt: Date;
}

MovieGenres.init(attributes, {sequelize: sequelizeConnection});

Movie.belongsToMany(Genre, {through: MovieGenres, foreignKey: 'movieId', otherKey: 'genreId'});
Genre.belongsToMany(Movie, {through: MovieGenres, foreignKey: 'genreId', otherKey: 'movieId'});

export default MovieGenres;
