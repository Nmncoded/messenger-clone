'use client'
import { User } from '@prisma/client'
import React, { useEffect, useMemo, useState } from 'react'
import UserBox from './UserBox'
import { pusherClient } from '@/app/libs/pusher'
import { useSession } from 'next-auth/react'
import { find } from 'lodash'

interface UsersListProps {
  initialUsers: User[]
}

const UsersList:React.FC<UsersListProps> = ({initialUsers}) => {
  const [items, setItems] = useState(initialUsers);

  const session = useSession();

  const pusherKey = useMemo(() => {
    return session.data?.user?.email;
  },[session.data?.user?.email]);

  useEffect(() => {
    if(!pusherKey) {
      return;
    }

    pusherClient.subscribe(pusherKey);

    const newHandler = (user: User) => {
      setItems((current) => {
        if(find(current,{id: user.id})) {
          return current;
        }
        return [user, ...current];
      })
    }


    pusherClient.bind('user:new', newHandler)

    return () => {
      pusherClient.unsubscribe(pusherKey);
      pusherClient.unbind('user:new',newHandler);
    }

  },[pusherKey]);

  return (
    <aside className='fixed inset-y-0 pb-20 lg:pb-0 lg:left-20 lg:w-80 lg:block overflow-y-auto border-r border-gray-200 block w-full left-0' >
      <div className='px-5' >
        <div className='flex-col' >
          <div className='text-2xl font-bold text-neutral-800 py-4' >
            People
          </div>
        </div>
        {
          items.map((item) => (
            <UserBox key={item.id} data={item} />
          ))
        }
      </div>
    </aside>
  )
}

export default UsersList