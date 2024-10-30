"use client";
import { User } from "@prisma/client";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import UserBox from "./UserBox";
import { pusherClient } from "@/app/libs/pusher";
import { useSession } from "next-auth/react";
import { find } from "lodash";
import { useRouter } from "next/navigation";
import getUsers from "@/app/actions/getUsers";
import LoadingModal from "@/app/components/LoadingModal";

interface UsersListProps {
  initialUsers: User[];
}

const UsersList: React.FC<UsersListProps> = ({ initialUsers }) => {
  const [items, setItems] = useState(initialUsers);
  const router = useRouter();
  const session = useSession();

  const pusherKey = useMemo(() => {
    return session.data?.user?.email;
  }, [session.data?.user?.email]);

  // console.log("--------------------- inside userlist component");

  useEffect(() => {
    setItems(initialUsers);

    if (!pusherKey) {
      return;
    }

    // console.log("------------------------ inside useEffect of userlist");

    // Add a channel-level subscription for global updates
    const globalChannel = "users-global";
    pusherClient.subscribe(globalChannel);
    pusherClient.subscribe(pusherKey);

    const newHandler = async (newUser: User) => {
      // console.log("---------------------- inside new user handler");

      setItems((currentUsers) => {
        if (find(currentUsers, { id: newUser.id })) {
          return currentUsers;
        }

        return [newUser, ...currentUsers];
      });
    };

    const globalUpdateHandler = async (updatedUser: User) => {
      // console.log("------------------------inside global user update handler");
      setItems((currentUsers) => {
        return currentUsers.map((user) => {
          if (user.id === updatedUser.id) {
            return updatedUser;
          }
          return user;
        });
      });
      // await refreshUsers();
    };

    pusherClient.bind("user:new", newHandler);
    pusherClient.bind("users:refresh", globalUpdateHandler);

    return () => {
      pusherClient.unsubscribe(globalChannel);
      pusherClient.unsubscribe(pusherKey);
      pusherClient.unbind("user:new", newHandler);
      pusherClient.unbind("users:refresh", globalUpdateHandler);
    };
  }, [pusherKey, router, initialUsers]);

  return (
    <aside className="fixed inset-y-0 pb-20 lg:pb-0 lg:left-20 lg:w-80 lg:block overflow-y-auto border-r border-gray-200 block w-full left-0">
      <div className="px-5">
        <div className="flex-col">
          <div className="text-2xl font-bold text-neutral-800 py-4">People</div>
        </div>
        {items.map((item) => (
          <UserBox key={item.id} data={item} />
        ))}
      </div>
    </aside>
  );
};

export default UsersList;
