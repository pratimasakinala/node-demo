import * as mongoose from 'mongoose';

const BaseSchema: mongoose.SchemaDefinition = new mongoose.Schema({
  deleted_at: {
    type: Date,
    default: null
  }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

export default BaseSchema;