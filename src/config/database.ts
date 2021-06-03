import { join } from 'path';
export default {
  type: 'mysql',
  host: '117.50.17.60',
  port: 3306,
  username: 'hlx-nest',
  password: 'DcXGf4KrM26ysc6D',
  database: 'hlx-nest',
  // 读取目录下所有entity的ts文件, 是每一个数据库的实体
  entities: [join(__dirname, '../', '**/**.entity{.ts,.js}')],
  synchronize: true,
  charset: 'utf8mb4',
};
