"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../helpers/utils");
const bad_request_error_1 = require("../errors/bad-request-error");
const constant_enum_1 = require("../helpers/constant-enum");
const models_1 = __importDefault(require("../models"));
class Comment {
    /**
     * Add new Comment
     * @param req
     * @param res
     */
    static add_comment(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { movie_title, comment, commenter } = req.body;
                const ip_address = req.ip;
                let comment_res = '';
                if (comment) {
                    if (comment.length > 500) {
                        throw new bad_request_error_1.BadRequestError('Comment is too long');
                    }
                    if (!commenter) {
                        throw new bad_request_error_1.BadRequestError('Commenter name is required');
                    }
                    if (!movie_title) {
                        throw new bad_request_error_1.BadRequestError('Movie title is required');
                    }
                    comment_res = yield models_1.default.Comment.create({
                        movie_title,
                        comment,
                        ip_address,
                        commenter
                    });
                }
                res.send({ result: comment_res, message: comment_res ? 'Comment added successfully' : 'Could not create comment', code: comment_res ? constant_enum_1.Codes.CREATED : constant_enum_1.Codes.BAD_REQUEST });
            }
            catch (error) {
                res.send({ error: error.message, code: constant_enum_1.Codes.BAD_REQUEST });
            }
        });
    }
    /**
     * Get all comments
     * @param req
     * @param res
     */
    static get_comments(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { limit, offset, page } = utils_1.Utils.paginate(req);
                const comments = yield models_1.default.Comment.findAndCountAll({
                    attributes: {
                        exclude: ['id', 'updated_at', 'commenter', 'movie_title']
                    },
                    order: [
                        ['created_at', 'DESC']
                    ],
                    limit,
                    offset,
                });
                const total_pages = (Math.ceil(comments.count / limit));
                const { next, previous } = utils_1.Utils.paginate_nav(total_pages, page);
                res.send({ results: comments.rows, total_pages, next, previous });
            }
            catch (error) {
                res.send({ error: error.message, code: constant_enum_1.Codes.BAD_REQUEST, stack: error.stack });
            }
        });
    }
}
exports.default = Comment;
