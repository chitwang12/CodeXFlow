import { marked } from "marked";
import  sanitizeHTML from "sanitize-html";
import logger from "../../config/logger.config";
import TurndownService from "turndown";


export async function sanitizeMarkdown(markdown: string): Promise<string> {
    if(!markdown || typeof markdown !== "string") {
        return "";
    }

    try {
        const convertHTML = await marked.parse(markdown);

        const sanitizedHTML =  sanitizeHTML(convertHTML, {
            allowedTags: sanitizeHTML.defaults.allowedTags.concat([ 'img', 'pre', 'code']),
            allowedAttributes: {
                ...sanitizeHTML.defaults.allowedAttributes,
                "img": [ "src", "alt", "title", "width", "height" ],
                "code": [ "class" ],
                "pre": [ "class" ],
                "a": [ "href", "title", "target", "rel" ]
            },
            allowedSchemes: [ 'http', 'https'],
            allowedSchemesByTag: {
                'img': [ 'http', 'https']
            }
        })
        const tds = new TurndownService();
        return tds.turndown(sanitizedHTML);
    } catch (error) {
        logger.error('Error sanitizing markdown:', error);
        return "";
    }
}