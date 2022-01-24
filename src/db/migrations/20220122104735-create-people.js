'use strict';

module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.sequelize.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";');

		return queryInterface.createTable('people', {
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
			biography: {
				type: Sequelize.TEXT
			},
			birthday: {
				type: Sequelize.DATEONLY
			},
			deathday: {
				type: Sequelize.DATEONLY
			},
			placeOfBirth: {
				field: 'place_of_birth',
				type: Sequelize.STRING
			},
			image: {
				type: Sequelize.STRING
			},
			imdb: {
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
		return queryInterface.dropTable('people');
	},
};
