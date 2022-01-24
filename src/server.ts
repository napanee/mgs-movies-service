import express from 'express';

import dbInit from './db/init';
import {Movie, MoviePeople, Person} from './db/models';


dbInit();

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.get('/', async (req, res) => {
	const movie = await Movie.findOne({
		where: {
			title: 'Matrix'
		},
		include: [
			// {
			// 	model: Genre,
			// 	// as: 'genres'
			// },
			{
				model: Person,
				attributes: ['name'],
				through: {
					attributes: ['character'],
					where: {
						department: 'actor'
					}
				},
			},
		],
		order: [
			[Person, MoviePeople, 'order', 'asc' ]
		]
	});
	console.log(movie?.People?.map((person) => person.toJSON()));
	res.send('Server running...');
});
app.listen(process.env.PORT, () => {
	console.log(`App starts on port ${process.env.PORT}`);
});
