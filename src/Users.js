import React from 'react';
import { Query, Mutation } from 'react-apollo'
import { gql } from 'apollo-boost'
import { ROOT_QUERY } from './App'

const ADD_FAKE_USERS_MUTATION = gql`mutation addFakeUsers($count:Int!) {
    addFakeUsers(count: $count){
        githubLogin
        name
        avatar
    }
}`

const UserListItem = ({ name, avatar }) =>
<li>
    <img src={ avatar } width={48} height={48} alt="" />
    <span>{name}</span>
</li>

const UserList = ({ count, users, refetchUsers})=>
<div>
    <div>{count} Users</div>
    <button onClick={()=> refetchUsers()}>Refetch</button>
    <Mutation 
    mutation={ADD_FAKE_USERS_MUTATION} 
    refetchQueries={[{ query: ROOT_QUERY }]}
    variables={{count:1}}
    >
        {addFakeUsers=>
        <button onClick={addFakeUsers} > Add Fake Users </button>
        }

    </Mutation>
    <ul>
        {users.map(user=>
            <UserListItem key={user.githubLogin} name={user.name} avatar={user.avatar} />
        )}
    </ul>
</div>

const Users = () =>
<Query query={ROOT_QUERY}>
    {
        ({data, loading , refetch })=>
        <div>Users are loading: {loading? <div>loading users......</div> : 
        <UserList count={data.totalUsers} 
        users={data.allUsers}
        refetchUsers={ refetch }
         /> }</div>
    }

</Query>
export default Users