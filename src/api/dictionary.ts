import request from '@/api/interceptor';

export interface Data {
  code: number;
  data: {};
  msg: string;
}

export function login(data: Data) {
  return request.post<Data>('/api/user/login', data);
}
