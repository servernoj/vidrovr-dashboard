export type ProcessingInfo = {
  status: 'success' | 'error';
  start: Date;
  end: Date;
}

export type Asset = {
  id: string;
  mime_type: string;
  feed_id: string;
  creation_date: Date;
  title: string;
  thumbnail: string;
  media_url: string;
  height: number;
  width: number;
  duration: number;
  fps: number;
  processing_info: ProcessingInfo;
}

type ApiError = {
  message: string,
  code: number,
}

export type ApiResponse<T> = {
  data: T,
  error: null
} | {
  data: null,
  error: ApiError
}
