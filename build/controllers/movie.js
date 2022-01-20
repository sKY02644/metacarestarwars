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
const sequelize_1 = require("sequelize");
const constant_enum_1 = require("../helpers/constant-enum");
const models_1 = __importDefault(require("../models"));
const sequelize_2 = __importDefault(require("sequelize"));
const axios_1 = __importDefault(require("axios"));
const end_points_1 = require("../config/end-points");
class Movie {
    /**
     * Get all movies
     * @param req
     * @param res
     */
    static get_movies(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield axios_1.default.get(Movie.movies_endpoint);
                const data = response.data.results
                    .sort((a, b) => +new Date(a.release_date) - +new Date(b.release_date))
                    .map((data) => ({
                    title: data.title,
                    opening_crawl: data.opening_crawl,
                    comment_count: 0,
                }));
                const movie_titles = data.map((data) => data.title);
                const comments = yield models_1.default.Comment.findAll({
                    attributes: [
                        [sequelize_2.default.fn('DISTINCT', sequelize_2.default.col('movie_title')), 'title'],
                        [sequelize_2.default.fn("COUNT", sequelize_2.default.col("movie_title")), "comment_count"]
                    ],
                    group: ["movie_title"],
                    where: {
                        movie_title: {
                            [sequelize_1.Op.in]: movie_titles
                        }
                    }
                });
                const comments_json = JSON.parse(JSON.stringify(comments, null, 2));
                let uniqueData = data.map((item) => {
                    const comment = comments_json.find((comment) => comment.title === item.title);
                    if (comment) {
                        item.comment_count = comment.comment_count;
                    }
                    return item;
                });
                /**
                 * IF title param was passed filter by it
                 */
                if (req.query.title) {
                    const filter_by = req.query.title;
                    uniqueData = uniqueData.filter((movie) => {
                        return movie.title.includes(filter_by);
                    });
                }
                res.send({ result: uniqueData, code: constant_enum_1.Codes.FOUND });
            }
            catch (error) {
                res.send({ error: error.message, code: constant_enum_1.Codes.BAD_REQUEST, stack: error.stack });
            }
        });
    }
}
exports.default = Movie;
Movie.movies_endpoint = end_points_1.ENDPOINT_URL.MOVIE;
