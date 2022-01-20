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
const constant_enum_1 = require("../helpers/constant-enum");
const memory_cache_1 = __importDefault(require("memory-cache"));
const axios_1 = __importDefault(require("axios"));
const utils_1 = require("../helpers/utils");
const bad_request_error_1 = require("../errors/bad-request-error");
const end_points_1 = require("../config/end-points");
class Character {
    /**
     * Get character by movie name
     * @param req
     * @param res
     */
    static get_characters(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { movie, sort_by, order_by, filter } = req.query;
                if (!movie) {
                    throw new bad_request_error_1.BadRequestError('Movie name is required');
                }
                let key = '__vSky__' + req.url;
                let cachedBody = memory_cache_1.default.get(key);
                if (cachedBody) {
                    res.send(cachedBody);
                    return;
                }
                else {
                    const response = yield axios_1.default.get(`${end_points_1.ENDPOINT_URL.MOVIE}?search=${movie}`); ///?search=Back
                    if (!response.data.count) {
                        throw new bad_request_error_1.BadRequestError('Couldn\'t find the movie characters');
                    }
                    const promises = [];
                    const urls = response.data.results[0].characters;
                    urls.map((result) => __awaiter(this, void 0, void 0, function* () {
                        promises.push(axios_1.default.get(result));
                    }));
                    const characters = yield axios_1.default.all(promises);
                    if (characters.length === 0 && characters) {
                        throw new bad_request_error_1.BadRequestError('Couldn\'t fetch data');
                    }
                    const response_data = characters.map((character) => {
                        return {
                            name: character.data.name,
                            height: +character.data.height,
                            gender: character.data.gender
                        };
                    });
                    let is_asc = 1; // 1 for ascending order 0 for descending order
                    let sort_bby = 'name'; // default to name if no sort_by was passed
                    let result = [];
                    if (order_by) {
                        is_asc = order_by.toLocaleLowerCase() == 'asc' ? 1 : 0;
                    }
                    if (sort_by) {
                        sort_bby = sort_by;
                    }
                    result = utils_1.Utils.getSortedData(response_data, sort_bby, is_asc);
                    if (filter) {
                        const filters = filter === 'unknown' ? 'n/a' : filter;
                        result = result.filter((character) => {
                            return character.gender === filters;
                        });
                    }
                    const height_cm = result.reduce((acc, curr) => acc + curr.height ? curr.height : 0, 0);
                    result = [
                        {
                            metadata: {
                                total_characters: result.length,
                                total_height: utils_1.Utils.cmToFeet(height_cm.toString())
                            },
                            data: result
                        }
                    ];
                    memory_cache_1.default.put(key, result, 10 * 1000);
                    res.send(result);
                }
            }
            catch (error) {
                res.send({ error: error.message, code: constant_enum_1.Codes.BAD_REQUEST });
            }
        });
    }
}
exports.default = Character;
Character.movies_endpoint = end_points_1.ENDPOINT_URL.MOVIE;
