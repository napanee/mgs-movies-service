'use strict';

module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.createTable('movies', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER
			},
			title: {
				allowNull: false,
				type: Sequelize.STRING
			},
			titleOriginal: {
				allowNull: false,
				field: 'title_original',
				type: Sequelize.STRING
			},
			runtime: {
				allowNull: false,
				type: Sequelize.INTEGER
			},
			releaseDate: {
				allowNull: false,
				field: 'release_date',
				type: Sequelize.DATEONLY
			},
			overview: {
				allowNull: false,
				type: Sequelize.TEXT
			},
			backdrop: {
				type: Sequelize.STRING
			},
			poster: {
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
		return queryInterface.dropTable('movies');
	},
};
