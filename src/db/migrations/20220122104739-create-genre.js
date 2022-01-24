'use strict';

module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.sequelize.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";');

		return queryInterface.createTable('genres', {
			id: {
				allowNull: false,
				primaryKey: true,
				type: Sequelize.UUID,
				defaultValue: Sequelize.literal('uuid_generate_v4()'),
			},
			name: {
				allowNull: false,
				type: Sequelize.STRING
			},
			tmdb: {
				type: Sequelize.INTEGER
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
		return queryInterface.dropTable('genres');
	},
};
