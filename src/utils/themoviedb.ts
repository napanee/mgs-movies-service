import fetch from 'cross-fetch';
import {JsonObject, SnakeCasedProperties} from 'type-fest';

import {transformKeys} from '../utils';


type QueryResponseType = {
	id: number,
	overview: string,
	poster_path: string,
	release_date: string,
	title: string,
}

type ImdbResponseType = {
	id: number,
	overview: string,
	poster_path: string,
	release_date: string,
	title: string,
}

type MovieDataType = {
    backdrop_path: string,
    genres: {
		id: number,
		name: string,
	}[],
    id: number,
    imdb_id: string,
    original_title: string,
    overview: string,
    poster_path: string,
    release_date: string,
    runtime: number,
    title: string,
}

type PersonType = {
    biography: string,
    birthday: string | null,
    deathday: string | null,
    id: number,
    imdb_id: string,
    name: string,
    place_of_birth: string | null,
    profile_path: string | null,
}

type CastType = {
	character: string,
	credit_id: string,
	id: number,
	order: number,
}

type CrewType = {
	credit_id: string,
	id: number,
	job: string,
}

type MovieCreditsType = {
	cast: CastType[],
	crew: CrewType[],
}

type MovieImageType = {
	file_path: string,
	width: number,
	height: number,
}

type MovieImagesType = {
	backdrops: MovieImageType[],
	posters: MovieImageType[],
}

function __fetch<T extends JsonObject>(endpoint: string) {
	return fetch(`https://api.themoviedb.org/3/${endpoint}`, {
		method: 'get',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json',
			'Authorization': `Bearer ${process.env.MOVIE_DB_KEY}`,
		}
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
		.then(({results}) => results.map((result) => transformKeys(result)));
}

export function searchWithImdb(id: number) {
	return __fetch<{movie_results: ImdbResponseType[]}>(`find/${id}?external_source=imdb_id&language=de-DE`)
		.then(({movieResults}) => movieResults.map((result) => transformKeys(result)));
}

export function fetchMovieData(id: number) {
	return __fetch<MovieDataType>(`movie/${id}?language=de`)
		.then(({id, imdbId, originalTitle, backdropPath, posterPath, ...rest}) =>
			({tmdb: id, imdb: imdbId, titleOriginal: originalTitle, backdrop: backdropPath, poster: posterPath, ...rest}));
}

export function fetchMovieCredits(id: number): Promise<{creditId: string; tmdb: number; department: string; character?: string; order?: number;}[]> {
	return __fetch<MovieCreditsType>(`movie/${id}/credits?language=de`)
		.then(({cast, crew}) => [
			...cast.map(({id, ...rest}) => ({tmdb: id, department: 'actor', ...transformKeys<Omit<CastType, 'id'>>(rest)})),
			...crew.filter(({job}) => job === 'Director')
				.map(({id, job, ...rest}) => ({tmdb: id, department: job.toLowerCase(), ...transformKeys<Omit<CrewType, 'id'|'job'>>(rest)}))
		]);
}

export function fetchPerson(id: number) {
	return __fetch<PersonType>(`person/${id}?language=de`)
		.then(({id, imdbId, profilePath, ...rest}) => ({tmdb: id, imdb: imdbId, image: profilePath, ...rest}));
}

export function fetchImages(id: number, lng?: string) {
	return __fetch<MovieImagesType>(`movie/${id}/images${lng ? `?language=${lng}` : ''}`)
		.then(({backdrops, posters}) => ({
			backdrops: backdrops.map((backdrop) => transformKeys(backdrop)),
			posters: posters.map((poster) => transformKeys(poster)),
		}));
}
