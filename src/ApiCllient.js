import { setContext } from "@apollo/client/link/context";
import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";

class ApolloAPI {
    constructor() {
      const httpLink = this.createLinkForApollo()
  
      const authLink = this.setContextForApollo()
  
      this.client = new ApolloClient({
        link: authLink.concat(httpLink),
        cache: new InMemoryCache(),
      });
    }

    createLinkForApollo = () => {
        return createHttpLink({
            uri: import.meta.env.VITE_BACKEND_URL,
        });
    }

    setContextForApollo = () => {
        return setContext((_, { headers }) => {
            const token = localStorage.getItem("authToken");
            return {
              headers: {
                ...headers,
                Authorization: token ? token : "",
              },
            };
        });
    }
}

export default ApolloAPI