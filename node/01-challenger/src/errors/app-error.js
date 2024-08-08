export class AppError extends Error {
    #status = 400
    #message = null;

    constructor(message, status) {
        super();
        this.#message = message;

        if (status) {
            this.#status = status;
        }
    }

    returnResponseError(response) {
        const errorResponse = {
            message: this.#message
        }

        return response.writeHead(this.#status).end(JSON.stringify(errorResponse));
    }
}