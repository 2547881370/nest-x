export interface TaskParams {
  platform: number;
  gkey: string;
  app_version: string;
  versioncode: string;
  market_id: string;
  _key: string;
  device_code: string;
  count: number;
  cat_id: number;
  tag_id: number;
  sort_by: number;
  start: number;
}

export interface TaskDetailedParams {
  platform: number;
  gkey: string;
  app_version: string;
  versioncode: string;
  market_id: string;
  _key: string;
  device_code: string;
  post_id: number;
  page_no: number;
  page_size: number;
  doc: number;
}
