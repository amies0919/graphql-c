import React from 'react';
import { Query } from 'react-apollo'
import { ROOT_QUERY } from './App'

const UserListItem = ({ name, avatar }) =>
<li>
    <img src={ avatar } width={48} height={48} alt="" />
    <span>{name}</span>
</li>

const UserList = ({ count, users})=>
<div>
    <div>{count} Users</div>
    <ul>
        {users.map(user=>
            <UserListItem key={user.githubLogin} name={user.name} avatar={user.avatar} />
        )}
    </ul>
</div>

const Users = () =>
<Query query={ROOT_QUERY}>
    {
        ({data, loading})=>
        <div>Users are loading: {loading? <div>loading users......</div> : 
        <UserList count={data.totalUsers} users={data.allUsers} /> }</div>
    }

</Query>
export default Users