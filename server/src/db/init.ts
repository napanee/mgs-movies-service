import {Genre, Movie, MovieGenres, MoviePeople, Person, User} from '@models/index';


const isDev = process.env.NODE_ENV === 'development';

const dbInit = () => Promise.all([
	Genre.sync({alter: isDev}),
	Movie.sync({alter: isDev}),
	MovieGenres.sync({alter: isDev}),
	MoviePeople.sync({alter: isDev}),
	Person.sync({alter: isDev}),
	User.sync({alter: isDev}),
]);

export default dbInit;
