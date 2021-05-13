import { join } from 'path';
export default {
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: 'root',
  database: 'test',
  // 读取目录下所有entity的ts文件, 是每一个数据库的实体
  entities: [join(__dirname, '../', '**/**.entity{.ts,.js}')],
  synchronize: true,
  charset: 'utf8mb4',
};
