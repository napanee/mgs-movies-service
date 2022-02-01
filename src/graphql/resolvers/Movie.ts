import {FindOptions, Includeable, IncludeOptions, Op, Order, WhereOptions} from 'sequelize';

import Genre from '../../db/models/Genre';
import Movie, {MovieInput, MovieOutput} from '../../db/models/Movie';
import Person from '../../db/models/Person';
import {fetchMovieCredits, fetchMovieData, fetchPerson} from '../../utils';
import {instanceOfFindOptions} from '../../utils/typecheck';


interface IOptions {
	include?: Includeable | Includeable[];
	oder?: Order;
	where?: WhereOptions<MovieInput>;
}

export interface IArgsGet {
	id?: number;
	title?: string;
}

export interface IArgsList {
	first: number;
	offset: number;
	orderBy: string;
}

export interface IArgsCreate {
	tmdb: number;
}

export interface IArgsUpdate {
	id: number;
	input: {
		backdrop: string;
		poster: string;
	};
}

export interface IArgsRefetch {
	id: number;
	input: {
		withImages: boolean;
	};
}

export interface IArgsDelete {
	id: number;
}

interface IListResponse {
	edges: {
		node: MovieOutput;
	}[];
	pageInfo: {
		hasNextPage: () => boolean;
		hasPreviousPage: () => boolean;
	};
	totalCount: number;
}

class MovieController {
	private model = Movie;

	async get({id, title}: IArgsGet): Promise<MovieOutput | null> {
		if (id && title) {
			throw new Error('You can only search by one attribute.');
		}

		if (!id && !title) {
			throw new Error('You must enter at least one attribute.');
		}

		const options: IOptions = {
			where: {}
		};

		if (id) {
			options.where = {id};
		}

		if (title) {
			options.where = {title};
		}

		return this.model.findOne(options);
	}

	async list(args: FindOptions): Promise<MovieOutput[]>;
	async list(args: IArgsList): Promise<IListResponse>;
	async list(args: IArgsList | FindOptions): Promise<IListResponse | MovieOutput[]> {
		if (instanceOfFindOptions(args)) {
			return this.model.findAll(args);
		}

		const limit = args.first;
		const offset = args.offset;
		const orderDirection = args.orderBy.startsWith('-') ? 'DESC' : 'ASC';
		const order: Order = [[args.orderBy.replace('-', ''), orderDirection]];
		const movies = await this.model.findAll({limit, offset, order});
		const totalCount = await this.model.count();

		return {
			edges: movies.map((node) => ({
				node,
			})),
			pageInfo: {
				hasNextPage: () => totalCount > limit + offset,
				hasPreviousPage: () => offset > 0
			},
			totalCount
		};
	}

	async create({tmdb: id}: IArgsCreate) {
		const {genres, tmdb, ...defaults} = await fetchMovieData(id);
		const [movieModel, isNew] = await Movie.findOrCreate({where: {tmdb: id}, defaults});

		if (!isNew) {
			return {
				ok: false,
				movie: movieModel,
				errors: [{
					field: 'id',
					message: 'This Movie already exists.'
				}]
			}
		}

		const genreModels = await Genre.findAll({where: {tmdb: {[Op.in]: genres.map((genre) => genre.id)}}});
		await movieModel.addGenres(genreModels);

		const people = await fetchMovieCredits(id);
		await Promise.all(
			people.map(async ({tmdb, ...data}) => {
				const {tmdb: id, ...defaults} = await fetchPerson(tmdb);
				const [personModel] = await Person.findOrCreate({where: {tmdb: id}, defaults});

				await movieModel.addPerson(personModel, {through: {...data}});
			})
		);

		return {
			movie: movieModel,
			ok: !!movieModel,
		}
	}

	async update({id, input: {backdrop, poster}}: IArgsUpdate) {
		const movieModel = await Movie.findByPk(id);

		if (!movieModel) {
			return {
				ok: false,
				errors: [{
					field: 'id',
					message: 'Movie not found.'
				}]
			}
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
		}
	}

	async refetch({id, input: {withImages} = {withImages: false}}: IArgsRefetch) {
		const movieModel = await Movie.findByPk(id);

		if (!movieModel) {
			return {
				ok: false,
				errors: [{
					field: 'id',
					message: 'Movie not found.'
				}]
			}
		}

		await movieModel.removeGenres();
		await movieModel.removePeople();

		const {genres, ...movieData} = await fetchMovieData(movieModel.tmdb);
		await movieModel.update(movieData, {hooks: withImages});
		const genreModels = await Genre.findAll({where: {tmdb: {[Op.in]: genres.map((genre) => genre.id)}}});
		await movieModel.addGenres(genreModels);

		const people = await fetchMovieCredits(movieModel.tmdb);
		await Promise.all(
			people.map(async ({tmdb, ...data}) => {
				const {tmdb: id, ...defaults} = await fetchPerson(tmdb);
				const [personModel] = await Person.findOrCreate({where: {tmdb: id}, defaults});

				await movieModel.addPerson(personModel, {through: {...data}});
			})
		);

		return {
			movie: movieModel,
			ok: !!movieModel,
		}
	}

	async delete({id}: IArgsDelete) {
		const deleted = await Movie.destroy({where: {id}, truncate: true});

		if (deleted === 1) {
			return {
				ok: true,
			}
		}

		return {
			ok: false,
			errors: [{
				field: 'id',
				message: 'Error during movie delete.'
			}]
		}
	}
}

export default MovieController;
