const express = require('express');
const graphqlHTTP = require('express-graphql');
const schema = require('./graphql/schema/schema');
const mongoose = require('mongoose');

const app = express();

// connect to mongoDB Atlas
mongoose.connect('your_MongoDB_string', {
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