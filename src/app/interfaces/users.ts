export interface UserEntity {
  id: number;
  username: string;
  email: string;
  created_at: Date;
}

export interface UserModel extends UserEntity {
  is_admin: boolean;
}
