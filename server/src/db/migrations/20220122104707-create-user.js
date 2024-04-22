'use strict';

module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.createTable('users', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER,
			},
			firstName: {
				allowNull: false,
				field: 'first_name',
				type: Sequelize.STRING,
			},
			lastName: {
				allowNull: false,
				field: 'last_name',
				type: Sequelize.STRING,
			},
			email: {
				allowNull: false,
				type: Sequelize.STRING,
			},
			password: {
				allowNull: false,
				type: Sequelize.STRING,
			},
			isActive: {
				allowNull: false,
				defaultValue: false,
				field: 'is_active',
				type: Sequelize.BOOLEAN,
			},
			token: {
				type: Sequelize.STRING,
			},
			createdAt: {
				allowNull: false,
				field: 'created_at',
				type: Sequelize.DATE,
			},
			updatedAt: {
				allowNull: false,
				field: 'updated_at',
				type: Sequelize.DATE,
			},
		});
	},

	down: (queryInterface) => {
		return queryInterface.dropTable('users');
	},
};
