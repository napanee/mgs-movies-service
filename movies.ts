import fetch from 'cross-fetch';
import {Op} from 'sequelize';

import dbInit from './src/db/init';
import {Person, Genre, Movie} from './src/db/models';


// dbInit();

interface IGenreListResponse {
	id: number;
	name: string;
}

interface ISearchImdbResponse {
	movie_results: {
		id: number;
	}[];
	tvResults: {
		name: string;
	}[];
}

interface IMovieResponse {
	genres: {
		id: number,
		name: string,
	}[],
	original_title: string,
	overview: string,
	release_date: string,
	runtime: number,
	title: string,
	backdrop_path: string,
	poster_path: string,
}

interface ICastCrew {
	id: number;
	character?: string;
	credit_id?: string;
	order: number;
	job?: string;
}

interface ICreditsResponse {
	cast: ICastCrew[];
	crew: ICastCrew[];
}

interface IPersonResponse {
	id: number,
	biography: string,
	birthday: string | null,
	deathday: string | null,
	imdb_id: string,
	name: string,
	place_of_birth: string | null,
	profile_path: null | null,
}

const
	// imdb = [
	// 	'tt0825232', 'tt0331811', 'tt0307155', 'tt0345658', 'tt0938733', 'tt1190080', 'tt0478087', 'tt0298203', 'tt0936501',
	// 	'tt1397280', 'tt2446042', 'tt0118571', 'tt2194499', 'tt0948470', 'tt1872181', 'tt0120586', 'tt0478970', 'tt2543164',
	// 	'tt0106977', 'tt0499549', 'tt0372784', 'tt0096895', 'tt0103776', 'tt0112462', 'tt0118688', 'tt1440129', 'tt1596345',
	// 	'tt0898266', 'tt0898266', 'tt0120611', 'tt0878804', 'tt0450259', 'tt0372183', 'tt0440963', 'tt0258463', 'tt0112573',
	// 	'tt0903747', 'tt3682448', 'tt1462758', 'tt0289879', 'tt0162222', 'tt0264464', 'tt0369339', 'tt0118880', 'tt1457767',

	// 	'tt0360486', 'tt0118884', 'tt1345836', 'tt0468569', 'tt0433362', 'tt1431045', 'tt1860357', 'tt0407887', 'tt1600402',
	// 	'tt1136608', 'tt1853728', 'tt0285531', 'tt1361310', 'tt1059786', 'tt1631867', 'tt1111422', 'tt0238380', 'tt3322364',
	// 	'tt0359950', 'tt1211956', 'tt0406759', 'tt3702996', 'tt0232500', 'tt0322259', 'tt0463985', 'tt1013752', 'tt1596343',
	// 	'tt1905041', 'tt0137523', 'tt0408345', 'tt0325980', 'tt0383574', 'tt0449088', 'tt1298650', 'tt0109830', 'tt0452694',
	// 	'tt0476964', 'tt1632708', 'tt0177789', 'tt2674426', 'tt0119177', 'tt0482572', 'tt1197624', 'tt0099653', 'tt0087332',

	// 	'tt0097428', 'tt0223897', 'tt2267998', 'tt0120689', 'tt2015381', 'tt2119532', 'tt0448157', 'tt1119646', 'tt1411697',
	// 	'tt0367959', 'tt0366548', 'tt0410297', 'tt0813715', 'tt0385002', 'tt0101120', 'tt0101120', 'tt0101120', 'tt0101120',
	// 	'tt0101120', 'tt0101120', 'tt0101120', 'tt0101120', 'tt0480249', 'tt0268380', 'tt0438097', 'tt1080016', 'tt1667889',
	// 	'tt1464540', 'tt0309698', 'tt0443543', 'tt0118971', 'tt0119094', 'tt2084970', 'tt1375666', 'tt1628841', 'tt0082971',
	// 	'tt0087469', 'tt0097576', 'tt0367882', 'tt0361748', 'tt0399201', 'tt0454848', 'tt0816692', 'tt0110148', 'tt0371746',

	// 	'tt1068680', 'tt0251160', 'tt0467406', 'tt0107290', 'tt0119567', 'tt0163025', 'tt0117913', 'tt0960790', 'tt0266697',
	// 	'tt0378194', 'tt1499658', 'tt2170439', 'tt1375670', 'tt1013743', 'tt0448011', 'tt1700258', 'tt2194599', 'tt0303487',
	// 	'tt0303487', 'tt0303487', 'tt0947802', 'tt3569230', 'tt4514018', 'tt3300542', 'tt1276104', 'tt0399295', 'tt0425210',
	// 	'tt2872732', 'tt1189340', 'tt3659388', 'tt0294144', 'tt1564367', 'tt0209144', 'tt1334027', 'tt0117060', 'tt0120755',
	// 	'tt0317919', 'tt1229238', 'tt2381249', 'tt4520364', 'tt2345759', 'tt0884328', 'tt0087800', 'tt0187078', 'tt1483013',

	// 	'tt1219289', 'tt2302755', 'tt0230600', 'tt0457430', 'tt1355644', 'tt0187393', 'tt0338337', 'tt0488120', 'tt1596280',
	// 	'tt2103281', 'tt0087928', 'tt0089822', 'tt0091777', 'tt0093756', 'tt0095882', 'tt0098105', 'tt0110857', 'tt1029360',
	// 	'tt0482571', 'tt1392214', 'tt1446714', 'tt2184339', 'tt2975578', 'tt4094724', 'tt1220634', 'tt0120804', 'tt0318627',
	// 	'tt0432021', 'tt0102798', 'tt0106108', 'tt0106108', 'tt2199571', 'tt0257076', 'tt0108052', 'tt0285403', 'tt0822854',
	// 	'tt1130884', 'tt0114369', 'tt0814314', 'tt0167404', 'tt5193460', 'tt3774114', 'tt1285016', 'tt0945513', 'tt0111257',

	// 	'tt0145487', 'tt0316654', 'tt0145487', 'tt0413300', 'tt4633694', 'tt0145487', 'tt0316654', 'tt0413300', 'tt2250912',
	// 	'tt0064116', 'tt0796366', 'tt1408101', 'tt0118480', 'tt0374455', 'tt0120201', 'tt0382992', 'tt3922818', 'tt1231583',
	// 	'tt0095016', 'tt0099423', 'tt0112864', 'tt0337978', 'tt0454921', 'tt0421073', 'tt0428167', 'tt0428167', 'tt0428167',
	// 	'tt0428167', 'tt0428167', 'tt1386697', 'tt0448134', 'tt0078346', 'tt0081573', 'tt0086393', 'tt0094074', 'tt0348150',
	// 	'tt0986263', 'tt0362227', 'tt1981115', 'tt3501632', 'tt1365519', 'tt1386703', 'tt0100802', 'tt0840361', 'tt2209764',

	// 	'tt0293662', 'tt0388482', 'tt0800241', 'tt1465522', 'tt0117998', 'tt0369179', 'tt0369179', 'tt0369179', 'tt0369179',
	// 	'tt0369179', 'tt0369179', 'tt0369179', 'tt0107048', 'tt1670345', 'tt3110958', 'tt1270797', 'tt0465234', 'tt1520211',
	// 	'tt3042408', 'tt0993846', 'tt1430132', 'tt0816711', 'tt0120903', 'tt0290334', 'tt1270798', 'tt0376994', 'tt0458525',
	// 	'tt1675434', 'tt0450385', 'tt1156398', 'tt1222817', 'tt0088763', 'tt0096874', 'tt0099088', 'tt0117381', 'tt3460252',
	// 	'tt5052448', 'tt2024469', 'tt3717490', 'tt4425200', 'tt2820852', 'tt2395427', 'tt4846340', 'tt0489099', 'tt3766354',

	// 	'tt5013056', 'tt0455944', 'tt1477834', 'tt2239822', 'tt1213641', 'tt4912910', 'tt0212985', 'tt1825683', 'tt2283362',
	// 	'tt0117381', 'tt0187078', 'tt1314655', 'tt0075314', 'tt0473705', 'tt2381941', 'tt0848228', 'tt0112442', 'tt0813715',
	// 	'tt0813715', 'tt0116629', 'tt0117500', 'tt1979320', 'tt0111161', 'tt0111161', 'tt0133093', 'tt0234215', 'tt4154664',
	// 	'tt5095030', 'tt0242653', 'tt4154796', 'tt1228705', 'tt1300854', 'tt1156398', 'tt6146586', 'tt4425200', 'tt0800369',
	// 	'tt0371746', 'tt0118480', 'tt0118480', 'tt0118480', 'tt0118480', 'tt0118480', 'tt0118480', 'tt0118480', 'tt0118480',

	// 	'tt0118480', 'tt4154756', 'tt3501632', 'tt6320628', 'tt1981115', 'tt6189022', 'tt0451279', 'tt1211837', 'tt0458339',
	// ],
	imdb = ['tt0133093'],
	sumCount = imdb.length
;

__fetch(`/genre/movie/list?language=de`)
	// .then(async ({genres}: {genres: IGenreListResponse[]}) => {
	// 	console.log('Delete all genres...');
	// 	await Genre.truncate({cascade: true});

	// 	console.log('Create new genres...');
	// 	await Genre.bulkCreate(genres.map(({id: tmdb, name}) => ({name, tmdb})));
	// })
	.then(() => {
		return Promise.all(
			imdb.map(async (id, index) => {
				const record = await _addMovie(id);

				console.log(`Finished (${index}/${sumCount}): ${record.get('title')}`);
			})
		);
	})
	.catch((error: Error) => {
		console.log(error.message);
	})
	.finally(() => {
		console.log('Finished!');
	});

function __fetch(endpoint: string) {
	return fetch(`https://api.themoviedb.org/3/${endpoint}`, {
		method: 'get',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json',
			'Authorization': `Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxZTNlZGNkMzVlYzEwMTdlZGNkMWM1NWUwNDg2ZTJlMiIsInN1YiI6IjViMjE2ZWNhMGUwYTI2NGQ4YTAxMDVjNiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.keNw3ZXtkxuyj0I-X5DHLVqED86kqVPedkEwmA0vBYE`,
		}
	})
	.then((response) => {
		if (response.ok) {
			return response.json();
		}

		throw new Error(`${endpoint} respond with status ${response.status}`);
	})
	.then((data) => {
		return data;
	})
	.catch((error) => {
		console.log(error);
	});
}

async function _addPersons(personMap: ICastCrew[], movieModel: Movie) {
	await Promise.all(personMap.map(async ({id, character = null, credit_id, job, order = null}) => {
		const {id: tmdb, biography, birthday, deathday, imdb_id: imdb, name, place_of_birth: placeOfBirth, profile_path: image}: IPersonResponse = await __fetch(`person/${id}?language=de`);
		const [personModel] = await Person.findOrCreate({where: {tmdb}, defaults: {name, biography, birthday, deathday, placeOfBirth, image, imdb}});
		const hasModel = await movieModel.hasPerson(personModel);

		if (!hasModel) {
			await movieModel.addPerson(personModel, {through: {character, department: job ? job.toLowerCase() : 'actor', creditId: credit_id, order}});
		}

		// await movieModel.setPeople([]);

		return personModel;
	}));
}

async function _addMovie(imdb: string) {
	const
		tmdb = await __fetch(`find/${imdb}?external_source=imdb_id`)
			.then((data: ISearchImdbResponse) => {
				if (data?.movie_results[0]?.id) {
					return data.movie_results[0].id;
				}

				throw new Error(`This ID is not assigned to a Movie: ${data?.tvResults?.[0]?.name || imdb}`)
			})
	;

	const {
		genres,
		original_title: titleOriginal,
		overview,
		release_date: releaseDate,
		runtime,
		title,
		backdrop_path: backdrop,
		poster_path: poster,
	}: IMovieResponse = await __fetch(`movie/${tmdb}?language=de`);
	const [movieModel, isNewMovie] = await Movie.findOrCreate({
		where: {tmdb},
		defaults: {imdb, titleOriginal, overview, releaseDate, runtime, title, backdrop, poster},
	});

	if (!isNewMovie) {
		return movieModel;
	}

	const {cast, crew}: ICreditsResponse = await __fetch(`movie/${tmdb}/credits?language=de`);

	const genreModels = await Genre.findAll({
		where: {
			tmdb: {
				[Op.in]: genres.map((genre) => genre.id)
			}
		}
	});

	await movieModel.addGenres(genreModels);

	await _addPersons(cast, movieModel);
	await _addPersons(crew.filter(({job}) => job === 'Director'), movieModel);

	return movieModel;
}
