import * as mongoose from 'mongoose';
import BaseSchema from '../models/base';

const extendSchema: Function = (schema: mongoose.SchemaDefinition, definition: mongoose.SchemaDefinition, options: mongoose.SchemaOptions = {}) => {
    const newSchema = new mongoose.Schema(
        Object.assign({}, schema.obj, definition),
        options || schema.options
    );

    Object.assign(newSchema.methods, BaseSchema.methods);

    newSchema.index({ deleted_at: 1 });

    return newSchema;
}

export default extendSchema;