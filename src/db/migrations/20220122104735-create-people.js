'use strict';

module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.createTable('people', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER,
			},
			name: {
				allowNull: false,
				type: Sequelize.STRING,
			},
			biography: {
				type: Sequelize.TEXT,
			},
			birthday: {
				type: Sequelize.DATEONLY,
			},
			deathday: {
				type: Sequelize.DATEONLY,
			},
			placeOfBirth: {
				field: 'place_of_birth',
				type: Sequelize.STRING,
			},
			image: {
				type: Sequelize.STRING,
			},
			imdb: {
				allowNull: false,
				type: Sequelize.STRING,
			},
			tmdb: {
				allowNull: false,
				type: Sequelize.INTEGER,
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
		return queryInterface.dropTable('people');
	},
};
