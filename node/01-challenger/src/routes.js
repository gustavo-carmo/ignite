import { Database } from "./database.js"
import { buildRoutePath } from "./utils/build-route-path.js";
import { randomUUID } from 'node:crypto';
import { validateTasksPostAndPut } from "./validators/tasks-post-put.js";
import { validateIfTaskExist } from "./validators/task-exist.js";

const database = new Database();

export const routes = [
    {
        method: 'GET',
        path: buildRoutePath('/tasks'),
        handler: (request, response) => {
            const { search } = request.query;
            let queryParams = null;

            if (search) {
                queryParams = {
                    name: search
                }
            }

            return response.end(JSON.stringify(database.select('tasks', queryParams)))
        }
    },
    {
        method: 'POST',
        path: buildRoutePath('/tasks'),
        handler: (request, response) => {
            validateTasksPostAndPut(request);

            const { title, description } = request.body;

            const task = {
                id: randomUUID(),
                title,
                description,
                completed_at: null,
                created_at: new Date(),
                updated_at: new Date(),
            }

            database.insert('tasks', task)

            return response.writeHead(201).end(JSON.stringify(task))
        }
    },
    {
        method: 'POST',
        path: buildRoutePath('/tasks/import'),
        handler: (request, response) => {
            // const { file } = request.body;
            /*
            const { title, description } = request.body;

            const task = {
                id: randomUUID(),
                title,
                description,
                completed_at: null,
                created_at: new Date(),
                updated_at: new Date(),
            }

            database.insert('tasks', task)
            */
            console.log("Cai no import!\n", request);
            return response.writeHead(201).end()
        }
    },
    {
        method: 'PUT',
        path: buildRoutePath('/tasks/:id'),
        handler: (request, response) => {
            validateIfTaskExist(request, database);
            validateTasksPostAndPut(request);

            const { id } = request.params;
            const { title, description } = request.body;

            const task = {
                title,
                description,
                updated_at: new Date(),
            }

            database.update('tasks', id, task);

            return response.writeHead(200).end()
        }
    },
    {
        method: 'DELETE',
        path: buildRoutePath('/tasks/:id'),
        handler: (request, response) => {
            validateIfTaskExist(request, database);
            const { id } = request.params;

            database.delete('tasks', id);

            return response.writeHead(204).end()
        }
    },
    {
        method: 'PATCH',
        path: buildRoutePath('/tasks/:id/complete'),
        handler: (request, response) => {
            validateIfTaskExist(request, database);
            const { id } = request.params

            database.update('tasks', id, {
                completed_at: new Date()
            });

            return response.writeHead(200).end()
        }
    },
]