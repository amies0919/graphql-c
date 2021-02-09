import React from 'react';
import ReactDOM from 'react-dom';
// import './index.css';
import App from './App';
// import reportWebVitals from './reportWebVitals';

import { ApolloProvider } from 'react-apollo';
import 
 { 
  InMemoryCache, 
  HttpLink, 
  ApolloLink,
  ApolloClient,
  split
 } from 'apollo-boost';
 import { WebSocketLink } from 'apollo-link-ws';
 import { getMainDefinition } from 'apollo-utilities';
import { persistCache } from 'apollo-cache-persist';


const httpLink = new HttpLink({ uri: 'http://localhost:4000/graphql'})
const wsLink = new WebSocketLink({ 
  uri: 'ws://localhost:4000/graphql',
  options: { 
    reconnect: true
   }
})
const authLink = new ApolloLink((operation, forward) => {
  operation.setContext(context => ({
    headers: {
      ...context.headers,
      authorization:localStorage.getItem('token')
    }
  }))
  return forward(operation)
})
const httpAuthLink = authLink.concat(httpLink)

const link = split(({query})=> {
 
  const { kind, operation } = getMainDefinition(query)
  console.log(kind, operation)
  return kind === 'OperationDefinition' && operation === 'subscription'

},
wsLink,
httpAuthLink
)



const cache = new InMemoryCache()
persistCache({
  cache,
  storage: localStorage
})
if(localStorage['apollo-cache-persist']) {
  let cacheData = JSON.parse(localStorage['apollo-cache-persist']);
  cache.restore(cacheData)
}

const client = new ApolloClient({ 
  cache,
  link
})

ReactDOM.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
    <App />
    </ApolloProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// // If you want to start measuring performance in your app, pass a function
// // to log results (for example: reportWebVitals(console.log))
// // or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();



