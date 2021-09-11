import axios from 'axios';

interface ReqParams {
  sessionId: string;
  action: 'order' | 'user2date2menu' | 'like';
  params?: GetMenusParams;
  data?: SelectMenuData | LikeData;
}

interface GetMenusParams {
  pos: number;
}

interface SelectMenuData {
  c: number;
  date: string;
  xl?: number;
}

interface LikeData {
  cid: number;
  val: number;
}

const BASE_URL = 'https://www.kroky.si/2016/';

export async function apiGet({ sessionId, action, params }: ReqParams) {
  const response = await axios.get(BASE_URL, {
    headers: {
      cookie: `PHPSESSID=${sessionId};`,
    },
    params: {
      mod: 'register',
      action,
      ...params,
    },
  });

  return response.data;
}

export async function apiPost({ sessionId, action, params, data }: ReqParams) {
  const response = await axios.post(BASE_URL, data, {
    headers: {
      cookie: `PHPSESSID=${sessionId};`,
    },
    params: {
      mod: 'register',
      action,
      ...params,
    },
  });

  return response.data;
}
