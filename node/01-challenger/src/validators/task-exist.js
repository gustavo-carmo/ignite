import { AppError } from "../errors/app-error.js";

export function validateIfTaskExist(request, database) {
    const { id } = request.params;

    const task = database.select('tasks', {
        id
    })[0]

    if (!task) {
        throw new AppError('Task not found!')
    }
}