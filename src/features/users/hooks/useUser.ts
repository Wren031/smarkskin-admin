import { useState } from "react";
import type { User } from "../typs/User";
import { users as initialUsers } from "../data/users";

export default function useUser() {
  const [users, setUsers] = useState<User[]>(initialUsers);

    const totalUsers = users.length;

    const activeUser = users.filter(u => u.status === "Active").length;
    const inActiveUser = users.filter(u => u.status === "Inactive").length;


  return {
    users,
    setUsers,
    totalUsers,
    activeUser,
    inActiveUser,
  };
}
