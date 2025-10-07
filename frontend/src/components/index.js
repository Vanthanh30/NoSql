import { useRoutes } from 'react-router-dom';
import { routes } from '../routers/index';
function AllRoute() {
    const element = useRoutes(routes);
    return element;
}
export default AllRoute;