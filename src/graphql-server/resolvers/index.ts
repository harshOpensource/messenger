import merge from "lodash.merge";
import users from "./users";
import messegesResolvers from "./messeges";
import conversationsResolvers from "./conversations";

const resolvers = merge({}, users, messegesResolvers, conversationsResolvers);

export default resolvers;
