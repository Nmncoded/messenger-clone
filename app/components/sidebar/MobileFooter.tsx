'use client'
import useConversation from '@/app/hooks/useConversation';
import useRoutes from '@/app/hooks/useRoutes';
import React, { use } from 'react'
import MobileItem from './MobileItem';

const MobileFooter = () => {
  const routes = useRoutes();
  const {isOpen} = useConversation();
  if(isOpen){
    return null;
  }
  return (
    <div className='fixed justify-between w-full bottom-0 z-40 flex items-center bg-white border-t-[1px] lg:hidden' > 
      {
        routes.map(({ href, icon: Icon, active, onClick}) => (
          <MobileItem key={href} href={href} icon={Icon} active={active} onClick={onClick} />
        ))
      }
    </div>
  )
}

export default MobileFooter