import request from '@/api/interceptor';

export interface Response {
  data: Datum[];
  errno: number;
  [property: string]: any;
}

export interface Datum {
  url: string;
  [property: string]: any;
}

//获取图片在线地址
export const getPicUrlService = (files: File, width: string) => {
  const fd = new FormData();
  fd.append('files', files);
  fd.append('width', width);
  return request.post<Response>('/produce_image_url', fd);
};
