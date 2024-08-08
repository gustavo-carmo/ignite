import { AppError } from "../errors/app-error.js";

export function validateTasksPostAndPut(request) {
    const { title, description } = request.body;

    if (!title) {
        throw new AppError('title is a required parameter and it was not informed!')
    }

    if (!description) {
        throw new AppError('description is a required parameter and it was not informed!')
    }
}