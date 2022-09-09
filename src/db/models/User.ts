import bcrypt from 'bcrypt';
import {DataTypes, Model, ModelAttributes, Optional} from 'sequelize';

import {sequelizeConnection} from '../connection';


interface UserAttributes {
	email: string;
	firstName: string;
	id: number;
	isActive: boolean;
	lastName: string;
	password: string;
	token: string | null;
	createdAt?: Date;
	updatedAt?: Date;
}

type OptionalAttributes = 'id'|'isActive'|'token';

export type UserInput = Optional<UserAttributes, OptionalAttributes>;

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

const hashPassword = (user: User) => {
	if (user.changed('password')) {
		const salt = bcrypt.genSaltSync(10);
		const encryptPassword = bcrypt.hashSync(user.getDataValue('password'), salt);

		user.setDataValue('password', encryptPassword);
	}
};

class User extends Model<UserAttributes, UserInput> implements UserAttributes {
	declare email: string;
	declare firstName: string;
	declare id: number;
	declare isActive: boolean;
	declare lastName: string;
	declare password: string;
	declare token: string | null;

	declare readonly createdAt: Date;
	declare readonly updatedAt: Date;
}

User.init(attributes, {hooks: {beforeSave: hashPassword}, sequelize: sequelizeConnection});

export default User;
