"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Utils = void 0;
const perf_hooks_1 = require("perf_hooks");
class Utils {
    /**
     *
     * GERNERATE UUID V4
     */
    static randomUUID() {
        var d = new Date().getTime(); //Timestamp
        var d2 = (perf_hooks_1.performance && perf_hooks_1.performance.now && (perf_hooks_1.performance.now() * 1000)) || 0; //Time in microseconds since page-load or 0 if unsupported
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16; //random number between 0 and 16
            if (d > 0) { //Use timestamp until depleted
                r = (d + r) % 16 | 0;
                d = Math.floor(d / 16);
            }
            else { //Use microseconds since page-load if supported
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
    static getSortedData(data, prop, isAsc) {
        return data.sort((a, b) => {
            return (a[prop] < b[prop] ? -1 : 1) * (isAsc ? 1 : -1);
        });
    }
    /**
     *
     * @param cm_vl as string
     * @returns string of converted cm to feet,inches
     */
    static cmToFeet(cm_vl) {
        const cm = parseInt(cm_vl);
        let inches = +(cm * 0.393700787);
        const feet = Math.floor(inches / 12);
        inches %= 12;
        return `${feet}ft ${inches.toFixed(2)}Inches`;
    }
    static paginate(req) {
        let page = 1;
        let size = 5;
        if (req.query.page) {
            const pageAsNumber = Number.parseInt(req.query.page.toString());
            let sizeAsNumber = size;
            if (req.query.size) {
                sizeAsNumber = Number.parseInt(req.query.size.toString());
            }
            console.log(pageAsNumber, sizeAsNumber);
            if (!Number.isNaN(pageAsNumber) && pageAsNumber > 0) {
                page = pageAsNumber;
            }
            if (!Number.isNaN(sizeAsNumber) && sizeAsNumber > 0 && sizeAsNumber < 10) {
                size = sizeAsNumber;
            }
        }
        return {
            limit: size,
            offset: ((page - 1) * size),
            page
        };
    }
    static paginate_nav(total_pages, page) {
        const next = total_pages > page ? `${process.env.NODE_ENV === 'production' ? process.env.BASEURL : this.BASEURL}comment?page=${page + 1}` : null;
        let previous = null;
        if (total_pages > page) {
            previous = `${process.env.NODE_ENV === 'production' ? process.env.BASEURL : this.BASEURL}comment?page=${page - 1}`;
            if ((page - 1) === 0) {
                previous = null;
            }
        }
        else if (total_pages === page) {
            previous = `${process.env.NODE_ENV === 'production' ? process.env.BASEURL : this.BASEURL}comment?page=${(page - 1)}`;
            if ((page - 1) === 0) {
                previous = null;
            }
        }
        return {
            next,
            previous
        };
    }
}
exports.Utils = Utils;
Utils.BASEURL = 'http://localhost:4546/api/';
