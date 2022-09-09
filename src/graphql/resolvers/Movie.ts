import {FindAndCountOptions, FindOptions, Op} from 'sequelize';

import Genre from '@models/Genre';
import Movie from '@models/Movie';
import Person from '@models/Person';
import {
	MovieConnection,
	MovieNode,
	MutationMovieCreateArgs,
	MutationMovieDeleteArgs,
	MutationMovieRefetchArgs,
	MutationMovieUpdateArgs,
	QueryMovieArgs,
} from '@src/graphql-types';
import {fetchMovieCredits, fetchMovieData, fetchPerson} from '@utils/index';


class MovieController {
	private model = Movie;

	async get({id, title}: QueryMovieArgs) {
		if (id && title) {
			throw new Error('You can only search by one attribute.');
		}

		if (!id && !title) {
			throw new Error('You must enter at least one attribute.');
		}

		const options: FindOptions = {
			where: {},
		};

		if (id) {
			options.where = {id};
		}

		if (title) {
			options.where = {title};
		}

		return this.model.findOne(options);
	}

	async list(options: FindAndCountOptions): Promise<MovieConnection>;
	async list(options: FindAndCountOptions, plain: boolean): Promise<MovieNode[]>;
	async list(options: FindAndCountOptions, plain = false): Promise<MovieConnection | MovieNode[]> {
		const {rows, count} = await this.model.findAndCountAll(options);

		if (plain) {
			return rows;
		}

		return {
			edges: rows.map((node) => ({node})),
			pageInfo: {
				hasNextPage: count > (options.offset || 0) + rows.length,
				hasPreviousPage: !!options.offset && options.offset > 0,
			},
			totalCount: count,
		};
	}

	async create({tmdb: id}: MutationMovieCreateArgs) {
		const {genres, tmdb, ...defaults} = await fetchMovieData(id);
		const [movieModel, isNew] = await Movie.findOrCreate({where: {tmdb}, defaults: {...defaults, tmdb}});

		if (!isNew) {
			return {
				ok: false,
				movie: movieModel,
				errors: [{
					field: 'id',
					message: 'This Movie already exists.',
				}],
			};
		}

		const genreModels = await Genre.findAll({where: {tmdb: {[Op.in]: genres.map((genre) => genre.id)}}});
		const people = await fetchMovieCredits(id);

		await movieModel.addGenres(genreModels);
		await Promise.all(
			people.map(async ({tmdb, ...data}) => {
				const {tmdb: id, ...defaults} = await fetchPerson(tmdb);
				const [personModel] = await Person.findOrCreate({where: {tmdb: id}, defaults: {...defaults, tmdb}});

				await movieModel.addPerson(personModel, {through: {...data}});
			})
		);

		return {
			movie: movieModel,
			ok: !!movieModel,
		};
	}

	async update({id, input: {backdrop, poster}}: MutationMovieUpdateArgs) {
		const movieModel = await Movie.findByPk(id);

		if (!movieModel) {
			return {
				ok: false,
				errors: [{
					field: 'id',
					message: 'Movie not found.',
				}],
			};
		}

		if (backdrop) {
			movieModel.backdrop = backdrop;
		}

		if (poster) {
			movieModel.poster = poster;
		}

		const newMovieModel = await movieModel.save();

		return {
			movie: newMovieModel,
			ok: !!newMovieModel,
		};
	}

	async refetch({id, input}: MutationMovieRefetchArgs) {
		const movieModel = await Movie.findByPk(id);

		if (!movieModel) {
			return {
				ok: false,
				errors: [{
					field: 'id',
					message: 'Movie not found.',
				}],
			};
		}

		await movieModel.removeGenres();
		await movieModel.removePeople();

		const {genres, ...movieData} = await fetchMovieData(movieModel.tmdb);
		const genreModels = await Genre.findAll({where: {tmdb: {[Op.in]: genres.map((genre) => genre.id)}}});
		const people = await fetchMovieCredits(movieModel.tmdb);

		await movieModel.update(movieData, {hooks: !!input?.withImages});
		await movieModel.addGenres(genreModels);
		await Promise.all(
			people.map(async ({tmdb, ...data}) => {
				const {tmdb: id, ...defaults} = await fetchPerson(tmdb);
				const [personModel] = await Person.findOrCreate({where: {tmdb: id}, defaults: {...defaults, tmdb}});

				await movieModel.addPerson(personModel, {through: {...data}});
			})
		);

		return {
			movie: movieModel,
			ok: !!movieModel,
		};
	}

	async delete({id}: MutationMovieDeleteArgs) {
		const deleted = await Movie.destroy({where: {id}, cascade: true});

		if (deleted === 1) {
			return {
				ok: true,
			};
		}

		return {
			ok: false,
			errors: [{
				field: 'id',
				message: 'Error during movie delete.',
			}],
		};
	}
}

export default MovieController;
