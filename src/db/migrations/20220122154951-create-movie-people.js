'use strict';

module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.createTable('movie_people', {
			movieId: {
				allowNull: false,
				field: 'movie_id',
				type: Sequelize.INTEGER,
				primaryKey: true,
				onDelete: 'CASCADE',
				references: {
					model: 'movies',
					key: 'id'
				}
			},
			personId: {
				allowNull: false,
				field: 'person_id',
				type: Sequelize.INTEGER,
				primaryKey: true,
				onDelete: 'CASCADE',
				references: {
					model: 'people',
					key: 'id'
				}
			},
			character: {
				type: Sequelize.STRING
			},
			creditId: {
				allowNull: false,
				field: 'credit_id',
				type: Sequelize.STRING,
				primaryKey: true
			},
			department: {
				allowNull: false,
				type: Sequelize.STRING,
				primaryKey: true
			},
			order: {
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
		return queryInterface.dropTable('movie_people');
	},
};
