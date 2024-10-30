"use client";
import { User } from "@prisma/client";
import React, { useEffect, useMemo, useState } from "react";
import UserBox from "./UserBox";
import { pusherClient } from "@/app/libs/pusher";
import { useSession } from "next-auth/react";
import { find } from "lodash";
import { useRouter } from "next/navigation";
import getUsers from "@/app/actions/getUsers";

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

  useEffect(() => {
    if (!pusherKey) {
      return;
    }

    pusherClient.subscribe(pusherKey);

    const newHandler = async (newUser: User) => {
      setItems((currentUsers) => {
        if (find(currentUsers, { id: newUser.id })) {
          return currentUsers;
        }

        return [newUser, ...currentUsers];
      });

      // Refresh the router to update server-side data
      router.refresh();
    };

    // Handler for when a user is updated
    const updateHandler = async (updatedUser: User) => {
      setItems((currentUsers) => {
        return currentUsers.map((user) => {
          if (user.id === updatedUser.id) {
            return updatedUser;
          }
          return user;
        });
      });
    };


    pusherClient.bind("user:new", newHandler);
    pusherClient.bind("user:update", updateHandler);

    return () => {
      pusherClient.unsubscribe(pusherKey);
      pusherClient.unbind("user:new", newHandler);
      pusherClient.unbind("user:update", updateHandler);
    };
  }, [pusherKey, router]);

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
