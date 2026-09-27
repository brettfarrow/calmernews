import { apiHandler } from '../../server/api';
import { loadItem } from '../../server/hn';

export default apiHandler(loadItem);
