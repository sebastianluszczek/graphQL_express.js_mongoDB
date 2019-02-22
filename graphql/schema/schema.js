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
    GraphQLNonNull,
    GraphQLInputObjectType
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

const FilmInput = new GraphQLInputObjectType({
    name: 'FilmInput',
    fields: () => ({
        name: {
            type: new GraphQLNonNull(GraphQLString)
        },
        genre: {
            type: new GraphQLNonNull(GraphQLString)
        },
        director_id: {
            type: new GraphQLNonNull(GraphQLID)
        },
        actors: {
            type: new GraphQLNonNull(GraphQLList(GraphQLString))
        }
    })
})


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
            async resolve(parent, args) {
                try {
                    const response = await Film.findById(args.id);
                    return response;
                } catch (err) {
                    throw err;
                }
            }
        },
        director: {
            type: DirectorType,
            args: {
                id: {
                    type: new GraphQLNonNull(GraphQLID)
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
                    type: new GraphQLNonNull(GraphQLID)
                }
            },
            resolve(parent, args) {
                return Actor.findById(args.id);
            }
        },
        films: {
            type: new GraphQLList(FilmType),
            args: {
                genre: {
                    type: GraphQLString
                }
            },
            async resolve(parent, args) {
                try {
                    if (args.genre) {
                        const result = await Film.find({
                            genre: args.genre
                        });
                        return result;
                    } else {
                        const result = await Film.find({});
                        return result;
                    }

                } catch (err) {
                    throw err;
                }
            }
        },
        directors: {
            type: new GraphQLList(DirectorType),
            async resolve(parent, args) {
                try {
                    const result = await Director.find({});
                    return result;
                } catch (err) {
                    throw err;
                }
            }
        },
        actors: {
            type: new GraphQLList(ActorType),
            async resolve(parent, args) {
                try {
                    const result = await Actor.find({});
                    return result;
                } catch (err) {
                    throw err;
                }
            }
        }
    }
});

const Mutations = new GraphQLObjectType({
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
            async resolve(parent, args) {
                try {
                    let director = new Director({
                        name: args.name,
                        age: args.age
                    });
                    const result = await director.save()
                    return result;
                } catch (err) {
                    throw err;
                }
            }
        },
        addActor: {
            type: ActorType,
            args: {
                name: {
                    type: new GraphQLNonNull(GraphQLString)
                },
                age: {
                    type: new GraphQLNonNull(GraphQLInt)
                }
            },
            async resolve(parent, args) {
                try {
                    let actor = new Actor({
                        name: args.name,
                        age: args.age
                    });
                    const result = await actor.save()
                    return result;
                } catch (err) {
                    throw err;
                }
            }
        },
        addFilm: {
            type: FilmType,
            args: {
                inputFilm: {
                    type: FilmInput
                }
            },
            async resolve(parent, args) {
                try {
                    let film = new Film({
                        name: args.inputFilm.name,
                        genre: args.inputFilm.genre,
                        director_id: args.inputFilm.director_id,
                        actors: args.inputFilm.actors
                    });
                    const result = await film.save();
                    return result;
                } catch (err) {
                    throw err;
                }
            }
        }
    }
})

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutations
})