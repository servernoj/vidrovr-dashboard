export type ProcessingInfo = {
  status: string;
  start: Date;
  end: Date;
}

export type Asset = {
  id: string;
  mimeType: string;
  feedID: string;
  creationDate: Date;
  title: string;
  thumbnail: string;
  mediaURL: string;
  height: number;
  width: number;
  duration: number;
  fps: number;
  processingInfo: ProcessingInfo;
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
