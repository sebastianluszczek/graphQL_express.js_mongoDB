const express = require('express');
const graphqlHTTP = require('express-graphql');
const schema = require('./graphql/schema/schema');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());

// connect to mongoDB Atlas
mongoose.connect('mongodb+srv://<login>:<password>@cluster0-ympqd.mongodb.net/film_database?retryWrites=true', {
    useNewUrlParser: true
});
mongoose.connection.once('on', () => {
    console.log('connected to database');
});

app.use('/graphql', graphqlHTTP({
    schema,
    graphiql: true
}));

app.listen(process.env.PORT || 4000, () => {
    console.log('Server started on port 4000....')
});
