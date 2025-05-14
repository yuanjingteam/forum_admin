import request from '@/api/interceptor';

export interface Data {
  code: number;
  data: { upload: string };
  msg: string;
}

// 上传文件
export function upLoadFile(FormData) {
  return request.post<Data>('/upLoad/update', FormData);
}
