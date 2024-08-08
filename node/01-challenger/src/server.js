import http from 'node:http';
import { json } from './middlewares/json.js';
import { routes } from './routes.js';
import { extractQueryParams } from './utils/extract-query-params.js';
import { AppError } from './errors/app-error.js';

const port = 3333;
const server = http.createServer(async (request, response) => {
    try {
        await json(request, response);

        const { method, url } = request;

        const route = routes.find(route => route.method === method && route.path.test(url));

        if (route) {
            const routeParams = request.url.match(route.path);
            const { query, ...params } = routeParams.groups;

            request.params = params;
            request.query = query ? extractQueryParams(query) : {};

            return route.handler(request, response);
        }

        return response.writeHead(404).end();
    } catch (error) {
        if (error instanceof AppError) {
            return error.returnResponseError(response);
        }

        console.error(error);
        return response.writeHead(500).end(JSON.stringify({
            error: 'Internal error',
            message: 'Something went wrong, please contact the support!'
        }))
    }
});


server.listen(port, () => {
    console.log("Server running on port: ", port);
});