// import logo from './logo.svg';
// import './App.css';
import React ,{ Component , Fragment} from 'react';
import Users from './Users'
import Photos from './Photos'
import PostPhoto from './PostPhoto'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import { gql } from 'apollo-boost'
import AuthorizedUser from './AuthorizedUser'
import { withApollo } from 'react-apollo'

export const ROOT_QUERY = gql`
  query allUsers {
    totalUsers
    totalPhotos
    allUsers {
      ...userInfo
    }
    me {
      ...userInfo
    }
    allPhotos {
      id
      name
      url
    }
  }
  fragment userInfo on User {
    githubLogin
    name
    avatar
  }
`
const LISTEN_FOR_USERS = gql`
  subscription {
    newUser{
      githubLogin
      name
      avatar
    }
  }
`
class App extends Component {
  componentDidMount(){
    let { client } = this.props
    this.listenForUsers = client
                          .subscribe({ query: LISTEN_FOR_USERS})
                          .subscribe(({data: {newUser}}) => {
                            const data = client.readQuery({query: ROOT_QUERY})
                            let newData = {
                              allUsers:[
                                ...data.allUsers,
                                newUser
                              ], 
                              totalUsers:data.totalUsers + 1
                            }
                            client.writeQuery({query: ROOT_QUERY, data:newData})
                          })

  }
  componentWillUnmount(){
    this.listenForUsers.unsubscribe()
  }
  render(){
    return(
      <BrowserRouter>
        <Switch>
          <Route exact path="/" component={()=>(
            <Fragment>
              <AuthorizedUser />
              <Users /> 
              <Photos />
            </Fragment>
          )}></Route>
          <Route path="/newPhoto" component={PostPhoto}></Route>
          <Route component={({location})=>(<h1>not found</h1>)}></Route>

        </Switch>
   
      </BrowserRouter>
    )
  }
}

export default withApollo(App);
