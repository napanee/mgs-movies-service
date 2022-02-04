'use strict';

module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.createTable('movie_genres', {
			movieId: {
				allowNull: false,
				field: 'movie_id',
				type: Sequelize.INTEGER,
				primaryKey: true,
				onDelete: 'CASCADE',
				references: {
					model: 'movies',
					key: 'id',
				},
			},
			genreId: {
				allowNull: false,
				field: 'genre_id',
				type: Sequelize.INTEGER,
				primaryKey: true,
				onDelete: 'CASCADE',
				references: {
					model: 'genres',
					key: 'id',
				},
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
		return queryInterface.dropTable('movie_genres');
	},
};
