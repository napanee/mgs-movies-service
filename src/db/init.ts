import {Genre, Movie, MovieGenres, MoviePeople, Person, User} from '@models/index';


const isDev = process.env.NODE_ENV === 'development';
const isTest = process.env.NODE_ENV !== 'test';

const dbInit = () => Promise.all([
	Genre.sync({alter: isDev || isTest}),
	Movie.sync({alter: isDev || isTest}),
	MovieGenres.sync({alter: isDev || isTest}),
	MoviePeople.sync({alter: isDev || isTest}),
	Person.sync({alter: isDev || isTest}),
	User.sync({alter: isDev || isTest}),
]);

export default dbInit;
