import type { UserStatus } from "./UserStatus";

export interface User {
  id: number;
  fullname: string;
  address: string;
  gender: "Male" | "Female";
  age: number;
  contact: string;
  status: UserStatus;
  image: string;
}