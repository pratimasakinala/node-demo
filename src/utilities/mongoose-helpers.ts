import { InvalidInputError, NotFoundError, UnhandledError } from './errors';
import * as _ from 'lodash';
import * as mongoose from 'mongoose';
import { Model, Document } from 'mongoose';

import IConditions from '../interfaces/IConditions';

const connection = () => {
    mongoose.connect(`${process.env.MONGO_URI}`);

    return mongoose.connection;
}

const find = async (model: Model<Document>, conditions: IConditions, next: Function) => {
    try {
        checkFunctionParameters(model, conditions, next);

        let documents = await model.find(_.get(conditions, 'query', {}))
            .populate(_.get(conditions, 'populate', ''))
            .select(_.get(conditions, 'select', ''))
            .sort(_.get(conditions, 'sort', ''))
            .limit(_.get(conditions, 'limit', 100));

        if (documents) return documents;
        else throw new UnhandledError(
            `Query failed for model ${model.modelName} using query ${JSON.stringify(conditions.query)}`
        );
    } catch (error) {
        next(error);
    }
}

const findOne = async (model: Model<Document>, conditions: IConditions, next: Function) => {
    try {
        checkFunctionParameters(model, conditions, next);

        let document = await model.findOne(conditions.query)
            .populate(_.get(conditions, 'populate', ''))
            .select(_.get(conditions, 'select', ''));

        if (document) return document;
        else throw new NotFoundError(
            `Document not found for model ${model.modelName} using query ${JSON.stringify(conditions.query)}`
        );
    } catch (error) {
        next(error);
    }
}

const findOneById = async (model: Model<Document>, conditions: IConditions, next: Function) => {
    try {
        checkFunctionParameters(model, conditions, next);

        const document = await model.findById(conditions.query)
            .populate(_.get(conditions, 'populate', ''))
            .select(_.get(conditions, 'select', ''));

        if (document) return document;
        else throw new NotFoundError(`Document not found for model ${model.modelName} using query _id: ${JSON.stringify(conditions.query)}`);
    } catch (error) {
        next(error);
    }
}

const save = async (model: Document, next: Function, populate: any) => {
    try {
        checkFunctionParameters(model, {type: 'Save Helper'}, next);

        let updatedDocument = await model.save();
        if (updatedDocument) {
            if (populate) updatedDocument = await updatedDocument.populate(populate).execPopulate();
            return updatedDocument;
        }
        else throw new UnhandledError(`Save failed for model ${model}`);
    } catch (error) {
        next(error);
    }
}

const softDelete = async (model: Model<Document>, conditions: IConditions, next: Function, userId: mongoose.Types.ObjectId) => {
    try {
        checkFunctionParameters(model, conditions, next);

        const document = await findOne(model, conditions, next);
        if (document) {
            Object.assign(document, {
                deleted_at: new Date(),
                deleted_by: userId
            });

            const updatedDocument = await document.save();

            if (updatedDocument) return updatedDocument;
            else throw new UnhandledError(`Soft delete failed for ${document}`);
        } else throw new NotFoundError(`Document not found for model ${model.modelName} using query ${JSON.stringify(conditions.query)}`);
    } catch (error) {
        next(error);
    }
}

const hardDelete = async (model, conditions, next) => {
    try {
        checkFunctionParameters(model, conditions, next);

        const documentRemoved = await model.remove(conditions.query);

        if (documentRemoved) return documentRemoved;
        else throw UnhandledError(`Document removal failed for ${model.modelName} using query ${JSON.stringify(conditions.query)}`);
    } catch (error) {
        next(error);
    }
}

const checkFunctionParameters = (model: any, conditions: IConditions, next: Function) => {
    let error;
    if (!model.modelName && !model._id)
        error = new InvalidInputError(`Invalid or missing parameter Model, expected a mongoose Model got: ${JSON.stringify(model)}`);
    else if (!conditions.query && conditions.type !== 'Save Helper')
        error = new InvalidInputError(`Invalid or missing parameter Conditions, expected an object of type Conditions got: ${JSON.stringify(conditions)}`);
    else if (!next)
        error = new InvalidInputError(`Invalid of missing parameter Next, expected the express next function got: ${JSON.stringify(next)}`);

    if (error && !next) {
        console.error(error);
        throw error;
    } else if (error && next) throw error;
}

// const updateMany = async (model, conditions, next) => {
//     try {
//         checkFunctionParameters(model, conditions, next);

//         return await model.updateMany(
//             conditions.query,
//             conditions.update,
//             (err, updatedRecords) => {
//                 if (err) throw UnhandledError(`UpdateMany failed for model ${model}`);

//                 return conditions.cb(updatedRecords);
//             });
//     } catch (error) {
//         next(error);
//     }
// }

export default {
    connection,
    find,
    findOne,
    findOneById,
    // objectIdConversion,
    save,
    softDelete,
    // hardDelete,
    // updateMany
}