import fp from "fastify-plugin";
import fastifyJwt from "@fastify/jwt";
import { serverConfig } from "../config";


export default fp(async (fastify) => {
    fastify.register(fastifyJwt, {
        secret: serverConfig.JWT_SECRET || 'codexflow-secret'
    });
});