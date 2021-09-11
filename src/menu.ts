import axios from 'axios';
import { JSDOM } from 'jsdom';

const BASE_URL = 'https://www.kroky.si/2016/';

interface GetMenuParams {
  sessionId: string;
  day: number;
}

interface Day {
  dayName: string;
  date: Date;
  menus: Menu[];
}

interface Menu {
  id: string;
  categoryId: number;
  menuId: number;

  menu: string;
  name: string;
  selected: boolean;
  xxl: boolean;
  hasXXL: boolean;
  likes: number;
  dislikes: number;
}

export default async function getMenu({
  sessionId: sessid,
  day,
}: GetMenuParams): Promise<Day> {
  const response = await axios.get(BASE_URL, {
    headers: {
      cookie: `PHPSESSID=${sessid};`,
    },
    params: {
      mod: 'register',
      action: 'order',
      pos: 0,
    },
  });

  const { window } = new JSDOM(response.data);

  const table = window.document.getElementsByClassName(
    'fancytable',
  )[0] as HTMLTableElement;

  const tableRows = Array.from(table.rows);

  const dayCell = table.tHead?.rows[0].cells[day];
  const dayName = dayCell?.getElementsByTagName('b')[0].innerHTML!;

  const date = dayCell
    ?.getElementsByClassName('date')[0]
    .innerHTML.slice(1, -1)
    .split('.')
    .reverse()
    .join('-');

  const menus: Menu[] = [];

  tableRows.forEach((row) => {
    if (row.cells.length <= 1) {
      return;
    }
    const cell = row.cells[day];
    const nameItems = cell.getElementsByClassName('lepo_ime');
    if (!nameItems.length) {
      return;
    }

    const input = cell.getElementsByTagName('input')[0];

    const menu = row.cells[0].getElementsByTagName('strong')[0].innerHTML;

    const hasXXL = !!cell.getElementsByClassName('xxl').length;
    const xxl = hasXXL
      ? !!cell
          .getElementsByClassName('xxl')[0]
          .getElementsByTagName('input')[0]
          .hasAttribute('checked')
      : false;

    const likes = cell
      .getElementsByClassName('like')[0]
      .getElementsByTagName('i')[0].innerHTML;

    const dislikes = cell
      .getElementsByClassName('dislike')[0]
      .getElementsByTagName('i')[0].innerHTML;

    menus.push({
      id: input.getAttribute('id')!,
      categoryId: parseInt(input.getAttribute('cat_id')!),
      menuId: parseInt(input.getAttribute('menu_id')!),
      menu,
      name: nameItems[0].innerHTML,
      selected: !!input.getAttribute('value'),
      xxl,
      hasXXL,
      likes: parseInt(likes),
      dislikes: parseInt(dislikes),
    });
  });

  return {
    dayName,
    date: new Date(date!),
    menus,
  };
}
