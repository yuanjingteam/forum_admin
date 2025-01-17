export type RoleType = '' | '*' | 'admin' | 'user';
export interface UserState {
  id: number;
  nickname?: string;
  email?: string;
  user_status?: number;
  role_names?: string[];
  avatar_path?: string;
}
