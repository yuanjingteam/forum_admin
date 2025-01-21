export type RoleType = '' | '*' | 'admin' | 'user';
export interface UserState {
  id: number;
  role_ids: number[];
  nickname?: string;
  email?: string;
  user_status?: number;
  code: string;
  role_names?: string[];
  role_id: number[];
  avatar_path?: string;
}
