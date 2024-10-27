import React from 'react'
import Sidebar from '../components/sidebar/Sidebar'
import UsersList from './components/UsersList'
import getUsers from '../actions/getUsers';

const UsersLayout = async({
  children
}:{children: React.ReactNode}) => {
  const users = await getUsers();
  return (
    <Sidebar>
      <div className='h-full' >
        <UsersList items={users} />
        {children}
      </div>
    </Sidebar>
  )
}

export default UsersLayout