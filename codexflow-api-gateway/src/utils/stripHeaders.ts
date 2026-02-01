import { FastifyRequest } from 'fastify';


const FORBIDDEN_HEADERS = [
    'x-user-id',
    'x-user-tier',
    'x-user-email',
]

export function stripUntrustedHeaders(request: FastifyRequest) {
    FORBIDDEN_HEADERS.forEach(header => {
        if (request.headers[header]) {
            delete request.headers[header];
        }
    });
}