import { Request, Response } from 'express'
import { Op } from 'sequelize'
import { Codes } from '../helpers/constant-enum'

import db from "../models"
import sequelize from 'sequelize'
import axios from 'axios'
import { ENDPOINT_URL } from '../config/end-points'
import { Comment } from '../models/mods/Comment'

export default class Movie {

    static readonly movies_endpoint = ENDPOINT_URL.MOVIE

    /**
     * Get all movies
     * @param req 
     * @param res 
     */
    
    static async get_movies(req: Request, res: Response){
        try {

            const response = await axios.get(Movie.movies_endpoint)
            const data = response.data.results
            .sort((a: {release_date: string}, b: {release_date: string}) =>  +new Date(a.release_date) - +new Date(b.release_date) )
            .map((data: any) => ({
                title: data.title,
                opening_crawl: data.opening_crawl,
                comment_count: 0,
            }))
        
            const movie_titles = data.map((data: any) => data.title)
        
            const comments = await Comment.findAll({
                attributes: [
                    [sequelize.fn('DISTINCT', sequelize.col('movie_title')), 'title'],
                    [sequelize.fn("COUNT", sequelize.col("movie_title")), "comment_count"]
               ],
               group: ["movie_title"],
                where: {
                    movie_title: {
                        [Op.in]: movie_titles
                    }
                }
            })
            
            const comments_json = JSON.parse(JSON.stringify(comments, null, 2))
            
            let uniqueData = data.map((item: { title: any; comment_count: any }) => {
                const comment = comments_json.find((comment: any) => comment.title === item.title)
                if (comment) {
                    item.comment_count = comment.comment_count
                }
                return item
            })

            /**
             * IF title param was passed filter by it
             */
            if(req.query.title){
                const filter_by = req.query.title
                uniqueData = uniqueData.filter((movie: any) => {
                    return movie.title.includes(filter_by)
                })
            }
               
           res.send({result: uniqueData,  code: Codes.FOUND})
            
        } catch (error: any) {
            res.send({error: error.message, code: Codes.BAD_REQUEST, stack: error.stack})
        }
    }

}