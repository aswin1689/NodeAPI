const express = require('express');
const logger = require('morgan');
const mongoose = require('mongoose');
const helmet = require('helmet');

mongoose.connect('mongodb://localhost/nodeapiproject', {
	useCreateIndex: true,
	useNewUrlParser: true,
	useUnifiedTopology: true
});
mongoose.set('useFindAndModify', false);

const app = express();

app.use(helmet());

// Routes test
const users = require('./routes/users');

//middleware
app.use(logger('dev'));
app.use(express.json());

app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
  });

//routes
app.use('/api', users);

//catch 404 errors and route them to error handler
app.use((req, res, next) => {
	const err = new Error('Not found');
	err.status = 404;
	next(err);
});
//error handler function
app.use((err, req, res, next) => {
	const error = app.get('env') === 'development' ? err : {};
	const status = err.status || 500;

	//respond to client
	res.status(status).json({
		error: {
			message: error.message
		}
	});

	//respond to ourselves(terminal)
	console.error(err);
});
//start the server
const port = app.get('port') || 8000;
app.listen(port, () =>
	console.log(`Express server is listening at port ${port}`)
);
