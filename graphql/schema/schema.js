const graphql = require('graphql');
const Film = require('../../models/film');
const Director = require('../../models/director');
const Actor = require('../../models/actor');

const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLSchema,
    GraphQLID,
    GraphQLInt,
    GraphQLList,
    GraphQLNonNull
} = graphql;

// GraphQL query types

const FilmType = new GraphQLObjectType({
    name: 'Film',
    fields: () => ({
        id: {
            type: GraphQLID
        },
        name: {
            type: GraphQLString
        },
        genre: {
            type: GraphQLString
        },
        director: {
            type: DirectorType,
            resolve(parent, args) {
                return Director.findById(parent.director_id);
            }
        },
        actors: {
            type: new GraphQLList(ActorType),
            resolve(parent, args) {
                return Actor.find({
                    _id: {
                        $in: parent.actors
                    }
                });
            }
        }
    })
});

const DirectorType = new GraphQLObjectType({
    name: 'Director',
    fields: () => ({
        id: {
            type: GraphQLID
        },
        name: {
            type: GraphQLString
        },
        age: {
            type: GraphQLInt
        },
        films: {
            type: new GraphQLList(FilmType),
            resolve(parent, args) {
                return Film.find({
                    director_id: parent.id
                });
            }
        }
    })
});

const ActorType = new GraphQLObjectType({
    name: 'Actor',
    fields: () => ({
        id: {
            type: GraphQLID
        },
        name: {
            type: GraphQLString
        },
        age: {
            type: GraphQLInt
        },
        films: {
            type: new GraphQLList(FilmType),
            resolve(parent, args) {
                return Film.find({
                    actors: parent.id
                });
            }
        }
    })
});


const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        film: {
            type: FilmType,
            args: {
                id: {
                    type: GraphQLID
                }
            },
            resolve(parent, args) {
                return Film.findById(args.id);
            }
        },
        director: {
            type: DirectorType,
            args: {
                id: {
                    type: GraphQLID
                }
            },
            resolve(parent, args) {
                return Director.findById(args.id);
            }
        },
        actor: {
            type: ActorType,
            args: {
                id: {
                    type: GraphQLID
                }
            },
            resolve(parent, args) {
                return Actor.findById(args.id);
            }
        },
        films: {
            type: new GraphQLList(FilmType),
            resolve(parent, args) {
                return Film.find({});
            }
        },
        directors: {
            type: new GraphQLList(DirectorType),
            resolve(parent, args) {
                return Director.find({});
            }
        },
        actors: {
            type: new GraphQLList(ActorType),
            resolve(parent, args) {
                return Actor.find({});
            }
        }
    }
});

const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addDirector: {
            type: DirectorType,
            args: {
                name: {
                    type: new GraphQLNonNull(GraphQLString)
                },
                age: {
                    type: new GraphQLNonNull(GraphQLInt)
                }
            },
            resolve(parent, args) {
                let director = new Director({
                    name: args.name,
                    age: args.age
                });
                return director.save()
            }
        },
        addFilm: {
            type: FilmType,
            args: {
                name: {
                    type: new GraphQLNonNull(GraphQLString)
                },
                genre: {
                    type: new GraphQLNonNull(GraphQLString)
                },
                director_id: {
                    type: new GraphQLNonNull(GraphQLID)
                }
            },
            resolve(parent, args) {
                let film = new Film({
                    name: args.name,
                    genre: args.genre,
                    director_id: args.director_id
                });
                return film.save();
            }
        }
    }
})

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
})