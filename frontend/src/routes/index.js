import { routes as clientRoute } from "./client";
import { adminRoute } from "./admin";

export const routes = [
    ...clientRoute,
    ...adminRoute,
];
