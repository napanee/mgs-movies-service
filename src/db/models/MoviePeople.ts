import {DataTypes, Model, ModelAttributes, Optional} from 'sequelize';

import Movie from './Movie';
import Person from './Person';

import {sequelizeConnection} from '../connection';


interface MoviePeopleAttributes {
	movieId: string;
	personId: string;
	creditId: string;
	department: string;
	character?: string;
	order?: number;
}

export interface MoviePeopleInput extends Required<MoviePeopleAttributes> {}
export interface MoviePeopleOutput extends Required<MoviePeopleAttributes> {}

const attributes: ModelAttributes = {
	movieId: {
		allowNull: false,
		type: DataTypes.UUID,
	},
	personId: {
		allowNull: false,
		type: DataTypes.UUID,
	},
	character: {
		allowNull: true,
		type: DataTypes.STRING,
	},
	creditId: {
		allowNull: false,
		type: DataTypes.STRING,
	},
	department: {
		allowNull: false,
		type: DataTypes.STRING,
	},
	order: {
		allowNull: true,
		type: DataTypes.INTEGER,
	},
};

class MoviePeople extends Model<MoviePeopleAttributes, MoviePeopleInput> implements MoviePeopleAttributes {
	declare movieId: string;
	declare personId: string;
	declare character: string;
	declare creditId: string;
	declare department: string;
	declare order: number;

	declare readonly createdAt: Date;
	declare readonly updatedAt: Date;
}

MoviePeople.init(attributes, {sequelize: sequelizeConnection});

Movie.belongsToMany(Person, {through: MoviePeople, foreignKey: 'movieId', otherKey: 'personId'});
Person.belongsToMany(Movie, {through: MoviePeople, foreignKey: 'personId', otherKey: 'movieId'});

export default MoviePeople;
