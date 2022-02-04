import bcrypt from 'bcrypt';
import {DataTypes, Model, ModelAttributes, Optional} from 'sequelize';

import {sequelizeConnection} from '../connection';


interface UserAttributes {
	email: string;
	firstName: string;
	id: string;
	isActive: boolean;
	lastName: string;
	password: string;
	createdAt?: Date;
	token?: string;
	updatedAt?: Date;
}

export type UserInput = Optional<UserAttributes, 'id' | 'isActive'>;
export type UserOutput = Required<UserAttributes>;

const attributes: ModelAttributes = {
	firstName: {
		allowNull: false,
		type: DataTypes.STRING,
		validate: {
			len: {
				args: [1, 50],
				msg: 'Name zu kurz oder lang',
			},
			notEmpty: {
				msg: 'Field is required',
			},
			notNull: {
				msg: 'Field is required',
			},
		},
	},
	lastName: {
		allowNull: false,
		type: DataTypes.STRING,
	},
	email: {
		allowNull: false,
		type: DataTypes.STRING,
	},
	password: {
		allowNull: false,
		type: DataTypes.STRING,
	},
	isActive: {
		allowNull: true,
		type: DataTypes.BOOLEAN,
		defaultValue: false,
	},
	token: {
		allowNull: true,
		type: DataTypes.STRING,
	},
};

const beforeCreate = (user: User) => {
	if (user.changed('password')) {
		const salt = bcrypt.genSaltSync(10);
		const encryptPassword = bcrypt.hashSync(user.getDataValue('password'), salt);

		user.setDataValue('password', encryptPassword);
	}
};

class User extends Model<UserAttributes, UserInput> implements UserAttributes {
	declare id: string;
	declare firstName: string;
	declare lastName: string;
	declare email: string;
	declare password: string;
	declare isActive: boolean;
	declare token?: string;

	declare readonly createdAt: Date;
	declare readonly updatedAt: Date;
}

User.init(attributes, {hooks: {beforeCreate}, sequelize: sequelizeConnection});

export default User;
