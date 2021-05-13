import { existsSync, mkdirSync } from 'fs';
import { dirname } from 'path';

export class Utils {
  static mkdirSync(_path) {
    if (existsSync(_path)) {
      return true;
    } else {
      if (this.mkdirSync(dirname(_path))) {
        mkdirSync(_path);
        return true;
      }
    }
    return false;
  }
}
