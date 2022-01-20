import { Request, Response } from 'express'
import { Codes } from 'src/helpers/constant-enum'

import Cache from 'memory-cache'

import axios from 'axios'
import { Utils } from 'src/helpers/utils'
import { BadRequestError } from 'src/errors/bad-request-error'
import { ENDPOINT_URL } from 'src/config/end-points'

export default class Character {

    static readonly movies_endpoint = ENDPOINT_URL.MOVIE

    /**
     * Get character by movie name
     * @param req 
     * @param res 
     */
    
    static async get_characters(req: Request, res: Response){
        try {

            
            const { movie, sort_by, order_by, filter } = <{movie: string, sort_by: string, order_by: string, filter: string }>req.query
    
            if(!movie){
                throw new BadRequestError('Movie name is required')
            }
    
            let key = '__vSky__' + req.url
            let cachedBody = Cache.get(key)
    
            if (cachedBody) {
                res.send(cachedBody)
                return
            }else{
                
                const response = await axios.get(`${ENDPOINT_URL.MOVIE}?search=${movie}`) ///?search=Back
        
                if(!response.data.count){
                    throw new BadRequestError('Couldn\'t find the movie characters')
                }
        
                const promises: any[] = []
        
                const urls = response.data.results[0].characters
        
                urls.map(async (result: any) => {
                    promises.push(axios.get(result)) 
                })
        
                const characters = await axios.all(promises)
        
                if(characters.length === 0 && characters){
                    throw new BadRequestError('Couldn\'t fetch data')
                }
        
                const response_data = characters.map((character: any) => {
                    return {
                        name: character.data.name,
                        height: +character.data.height,
                        gender: character.data.gender
                    }
                })
    
                let is_asc = 1; // 1 for ascending order 0 for descending order
                let sort_bby = 'name' // default to name if no sort_by was passed
                let result: {}[]=[]
    
                if(order_by){
                    is_asc = order_by.toLocaleLowerCase() == 'asc' ? 1 : 0
                }
    
                if(sort_by){
                    sort_bby = sort_by
                }
    
                result = Utils.getSortedData(response_data, sort_bby, is_asc)
    
                if(filter){
                    const filters = filter === 'unknown' ? 'n/a' : filter
    
                    result = result.filter((character: any) => {
                        return character.gender === filters
                    })
                }
    
                const height_cm = result.reduce((acc: number, curr: any) => acc + curr.height ? curr.height : 0 , 0)
    
                result = [
                    {
                        metadata: {
                            total_characters: result.length,
                            total_height: Utils.cmToFeet(height_cm.toString())
                        },
                        data: result
                    }
                ]
    
                Cache.put(key, result, 10 * 1000)
        
                res.send(result)
            }
    
        } catch (error: any) {
            res.send({error: error.message, code: Codes.BAD_REQUEST})
        }
    }

}