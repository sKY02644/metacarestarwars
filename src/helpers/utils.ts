import { performance } from 'perf_hooks';
import { Request } from 'express'


export class Utils {


    static BASEURL: string = 'http://localhost:4546/api/'

    /**
     * 
     * GERNERATE UUID V4 
     */
    static randomUUID() {
        var d = new Date().getTime();//Timestamp
        var d2 = (performance && performance.now && (performance.now() * 1000)) || 0;//Time in microseconds since page-load or 0 if unsupported
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16;//random number between 0 and 16
            if (d > 0) {//Use timestamp until depleted
                r = (d + r) % 16 | 0;
                d = Math.floor(d / 16);
            } else {//Use microseconds since page-load if supported
                r = (d2 + r) % 16 | 0;
                d2 = Math.floor(d2 / 16);
            }
            return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
    }

    /**
     * 
     * @param data 
     * @param prop 
     * @param isAsc 
     * @returns sorted data ASC|DESC
     */
    static getSortedData(data: any[], prop: string | number, isAsc: number) {
        return data.sort((a: { [x: string]: number }, b: { [x: string]: number }) => {
            return (a[prop] < b[prop] ? -1 : 1) * (isAsc ? 1 : -1)
        });
    }

    /**
     * 
     * @param cm_vl as string
     * @returns string of converted cm to feet,inches
     */
    static cmToFeet (cm_vl: string){
        const cm = parseInt(cm_vl)
        let inches = +(cm*0.393700787);
        const feet = Math.floor(inches / 12);
        inches %= 12;
        return`${feet}ft ${inches.toFixed(2)}Inches`
    }

    static paginate(req: Request){

        let page = 1
        let size = 5

        if(req.query.page){

            const pageAsNumber = Number.parseInt(req.query.page.toString())
            let sizeAsNumber = size

            if(req.query.size){
                sizeAsNumber = Number.parseInt(req.query.size.toString())
            }

            console.log(pageAsNumber, sizeAsNumber)

            if(!Number.isNaN(pageAsNumber) && pageAsNumber > 0){
                page = pageAsNumber
            }

            if(!Number.isNaN(sizeAsNumber)  && sizeAsNumber > 0 && sizeAsNumber < 10){
                size = sizeAsNumber
            }
        }

        return {
            limit: size,
            offset: ((page - 1) * size),
            page
        }
    }

    static paginate_nav(total_pages: number, page: number){
        const next = total_pages > page ? `${process.env.NODE_ENV === 'production' ? process.env.BASEURL : this.BASEURL}comment?page=${page + 1}` : null
        let previous: string | null = null
    
        if( total_pages > page){
            previous = `${process.env.NODE_ENV === 'production' ? process.env.BASEURL : this.BASEURL}comment?page=${page - 1}`
            if((page - 1) === 0){
                previous = null
            }
        }else if(total_pages === page){
            previous = `${process.env.NODE_ENV === 'production' ? process.env.BASEURL : this.BASEURL}comment?page=${(page - 1)}`
            if((page - 1) === 0){
                previous = null
            }
        }

        return {
            next,
            previous
        }

    }
    
}
