export type RoleType = '' | '*' | 'admin' | 'user';
export interface UserState {
  nickname?: string;
  email?: string;
  user_status?: number;
  role_ids?: number[];
  avatar_path?: string;
}
