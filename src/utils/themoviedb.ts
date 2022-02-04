import fetch from 'cross-fetch';
import {CamelCasedProperties, JsonObject, SnakeCasedProperties} from 'type-fest';

import {transformKeys} from '../utils';


type QueryResponseType = {
	id: number;
	overview: string;
	poster_path: string;
	release_date: string;
	title: string;
};

type ImdbResponseType = {
	id: number;
	overview: string;
	poster_path: string;
	release_date: string;
	title: string;
};

type MovieDataType = {
	backdrop_path: string | null;
	genres: {
		id: number;
		name: string;
	}[];
	id: number;
	imdb_id: string;
	original_title: string;
	overview: string | null;
	poster_path: string | null;
	release_date: string;
	runtime: number | null;
	title: string;
};

type PersonType = {
	biography: string;
	birthday: string | null;
	deathday: string | null;
	id: number;
	imdb_id: string;
	name: string;
	place_of_birth: string | null;
	profile_path: string | null;
};

interface ICredit extends JsonObject {
	credit_id: string;
	id: number;
}

interface ICast extends ICredit {
	character: string;
	order: number;
}

interface ICrew extends ICredit {
	job: string;
}

interface IMovieCredits extends JsonObject {
	cast: ICast[];
	crew: ICrew[];
}

type MovieImageType = {
	file_path: string;
	height: number;
	width: number;
};

type MovieImagesType = {
	backdrops: MovieImageType[];
	posters: MovieImageType[];
};

// eslint-disable-next-line max-len
interface IMovieCreditsResponse extends Omit<ICredit, 'id'>, Partial<Omit<ICast, keyof ICredit>>, Partial<Omit<ICrew, keyof ICredit>> {
	department: string;
	tmdb: number;
}

function __fetch<T extends JsonObject>(endpoint: string) {
	return fetch(`https://api.themoviedb.org/3/${endpoint}`, {
		method: 'get',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json',
			'Authorization': `Bearer ${process.env.MOVIE_DB_KEY}`,
		},
	})
		.then((response) => {
			if (response.ok) {
				return response.json();
			}

			throw new Error(`${endpoint} respond with status ${response.status}`);
		})
		.then((data: SnakeCasedProperties<T>) => transformKeys(data));
}

export function searchWithQuery(query: string) {
	return __fetch<{results: QueryResponseType[]}>(`search/movie?query=${query}&language=de-DE`)
		.then(({results}) => {
			return results
				.map((result) => transformKeys(result))
				.filter(({id, overview, posterPath, releaseDate, title}) =>
					({id, overview, posterPath, releaseDate, title}));
		});
}

export function searchWithImdb(id: number) {
	return __fetch<{movie_results: ImdbResponseType[]}>(`find/${id}?external_source=imdb_id&language=de-DE`)
		.then(({movieResults}) => {
			return movieResults
				.map((result) => transformKeys(result))
				.filter(({id, overview, posterPath, releaseDate, title}) =>
					({id, overview, posterPath, releaseDate, title}));
		});
}

export function fetchMovieData(id: number) {
	return __fetch<MovieDataType>(`movie/${id}?language=de`)
		.then(({
			backdropPath: backdrop,
			genres,
			id: tmdb,
			imdbId: imdb,
			originalTitle: titleOriginal,
			overview,
			posterPath: poster,
			releaseDate,
			runtime,
			title,
		}) => {
			return {backdrop, genres, tmdb, imdb, titleOriginal, overview, poster, releaseDate, runtime, title};
		});
}

export function fetchMovieCredits(id: number): Promise<CamelCasedProperties<IMovieCreditsResponse>[]> {
	return __fetch<IMovieCredits>(`movie/${id}/credits?language=de`)
		.then(({cast, crew}) => [
			...cast
				.map((result) => transformKeys(result))
				.map(({id: tmdb, character, creditId, order}) =>
					({tmdb, department: 'actor', character, creditId, order})),
			...crew.filter(({job}) => job === 'Director')
				.map((result) => transformKeys(result))
				.map(({id: tmdb, job, creditId}) => ({tmdb, department: job.toLowerCase(), creditId})),
		]);
}

export function fetchPerson(id: number) {
	return __fetch<PersonType>(`person/${id}?language=de`)
		.then(({id: tmdb, imdbId: imdb, profilePath: image, biography, birthday, deathday, name, placeOfBirth}) => {
			return {tmdb, imdb, image, biography, birthday, deathday, name, placeOfBirth};
		});
}

export function fetchImages(id: number, lng?: string) {
	return __fetch<MovieImagesType>(`movie/${id}/images${lng ? `?language=${lng}` : ''}`)
		.then(({backdrops, posters}) => ({
			backdrops: backdrops
				.map((backdrop) => transformKeys(backdrop))
				.map(({filePath, width, height}) => ({filePath, width, height})),
			posters: posters
				.map((poster) => transformKeys(poster))
				.map(({filePath, width, height}) => ({filePath, width, height})),
		}));
}
