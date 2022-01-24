'use strict';

module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.sequelize.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";');

		return queryInterface.createTable('users', {
			id: {
				allowNull: false,
				primaryKey: true,
				type: Sequelize.UUID,
				defaultValue: Sequelize.literal('uuid_generate_v4()'),
			},
			firstName: {
				allowNull: false,
				field: 'first_name',
				type: Sequelize.STRING
			},
			lastName: {
				allowNull: false,
				field: 'last_name',
				type: Sequelize.STRING
			},
			email: {
				allowNull: false,
				type: Sequelize.STRING
			},
			password: {
				allowNull: false,
				type: Sequelize.STRING
			},
			isActive: {
				allowNull: false,
				defaultValue: false,
				field: 'is_active',
				type: Sequelize.BOOLEAN
			},
			token: {
				type: Sequelize.STRING
			},
			createdAt: {
				allowNull: false,
				field: 'created_at',
				type: Sequelize.DATE
			},
			updatedAt: {
				allowNull: false,
				field: 'updated_at',
				type: Sequelize.DATE
			}
		});
	},

	down: (queryInterface, Sequelize) => {
		return queryInterface.dropTable('users');
	}
};
