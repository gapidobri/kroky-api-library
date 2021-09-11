import menu from './menu';
import { apiGet, apiPost } from './request';
import { config } from 'dotenv';

config();

async function main() {
  // console.log(
  //   await menu({
  //     sessionId: 'process.env.TOKEN!,
  //     day: 2,
  //   }),
  // );

  console.log(
    await apiPost({
      sessionId: process.env.TOKEN!,
      action: 'like',
      data: {
        cid: 25131,
        val: 1,
        // c: 26131,
        // date: '2021-09-13',
      },
    }),
  );
}

main();
