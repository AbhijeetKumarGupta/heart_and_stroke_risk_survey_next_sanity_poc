import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";

const SPACE_ID = process.env.CONTENTFUL_SPACE_ID || "";
const ACCESS_TOKEN = process.env.CONTENTFUL_ACCESS_TOKEN || "";

const client = new ApolloClient({
  link: new HttpLink({
    uri: `https://graphql.contentful.com/content/v1/spaces/${SPACE_ID}`,
    headers: {
      Authorization: `Bearer ${ACCESS_TOKEN}`,
    },
  }),
  cache: new InMemoryCache(),
});

export default client;
