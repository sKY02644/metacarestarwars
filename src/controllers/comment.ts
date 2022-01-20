import { Request, Response } from 'express'
import { Utils } from '../helpers/utils'
import { BadRequestError } from '../errors/bad-request-error'
import { Codes } from '../helpers/constant-enum'


import db from "../models"
import { Comment } from '../models/Comment'

export default class CommentController {

    /**
     * Add new Comment
     * @param req 
     * @param res 
     */
    static async add_comment (req: Request, res: Response) {  

        try {
    
            const { movie_title, comment, commenter } = <{movie_title: string, comment: string, commenter: string}>req.body
            const ip_address = req.ip
        
            let comment_res
    
            if(comment){
                if(comment.length > 500) {
                    throw new BadRequestError('Comment is too long')
                }
        
                if(!commenter) {
                    throw new BadRequestError('Commenter name is required')
                }
        
                if(!movie_title){
                    throw new BadRequestError('Movie title is required')
                }
        
                comment_res = await Comment.create({
                     movie_title,
                     comment,
                     ip_address,
                     commenter
                })
            }
            
            res.send({result: comment_res, message: comment_res ? 'Comment added successfully' : 'Could not create comment', code: comment_res ? Codes.CREATED : Codes.BAD_REQUEST})
    
        } catch (error: any) {
            res.send({error: error.message, code: Codes.BAD_REQUEST})
        }
    }

    /**
     * Get all comments
     * @param req 
     * @param res 
     */
    
    static async get_comments (req: Request, res: Response){
        try {

            const { limit, offset, page } = Utils.paginate(req)
    
            const comments = await Comment.findAndCountAll({
                attributes: {
                    exclude: ['id', 'updated_at', 'commenter', 'movie_title']
                },
                order: [
                    ['created_at', 'DESC']
                ],
                limit,
                offset,
            })
    
            const total_pages = (Math.ceil(comments.count / limit))

            const { next, previous} = Utils.paginate_nav(total_pages, page)

            res.send({ results: comments.rows, total_pages, next, previous})
    
        } catch (error: any) {
            res.send({error: error.message, code: Codes.BAD_REQUEST, stack: error.stack})
        }
    }

}