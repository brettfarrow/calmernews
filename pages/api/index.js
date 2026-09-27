import { apiHandler } from '../../server/api';
import { loadNews } from '../../server/hn';

export default apiHandler(loadNews);
