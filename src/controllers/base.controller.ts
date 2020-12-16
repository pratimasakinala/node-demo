import { Model } from "mongoose";

export default class BaseController {
    model: any;
    key: string;
    populate: Object[] | string[];
    select: string;
    sort: string;

    constructor(
        model: Model<any>,
        key: string,
        populate?: Object[] | string[],
        select?: string,
        sort?: string
    ) {
        this.model = model;
        this.key = key;
        this.populate = populate || [];
        this.select = select || '';
        this.sort = sort || '';
    }
}