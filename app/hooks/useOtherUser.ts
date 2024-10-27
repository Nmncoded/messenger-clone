import { Conversation, User, Message } from '@prisma/client'
import React, { useCallback, useMemo } from 'react'
import {useSession} from 'next-auth/react';
import { FullConversationType } from '@/app/types'

const useOtherUser = (conversation: FullConversationType | {users: User[]}) => {
  const session = useSession();

  const otherUser = useMemo(() => {
    const currentUserEmail = session?.data?.user?.email;
    const otherUser = conversation?.users?.filter(user => user.email !== currentUserEmail);
    // console.log(conversation.users,currentUserEmail,otherUser);
    return otherUser
  }, [conversation.users, session?.data?.user?.email]);

  return otherUser?.[0];  
}

export default useOtherUser;