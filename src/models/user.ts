import * as mongoose from 'mongoose';
import * as _ from 'lodash';

import extendSchema from '../utilities/extend-schema';

import BaseSchema from './base';

interface IUser extends mongoose.Document {
    email: string,
    first_name: string,
    full_name: string,
    last_name: string,
    user_name: string
}

const UserSchema: any = extendSchema(BaseSchema, {
    deactivated: { type: Boolean, default: false, required: true },
    email: { type: String, lowercase: true, required: true, unique: true },
    first_name: { type: String, default: null, required: false },
    full_name: { type: String, default: '' },
    initial_login:{ type: Boolean, default: true },
    last_login: { type: Date, default: Date.now },
    last_name: { type: String, default: null },
    password: { type: String, required: true },
    password_reset_at: { type: Date, default: null },
    user_name: { type: String }
});

UserSchema.pre('save', function save(this: IUser, next: Function) {
    const user = this;

    if (!user.user_name) user.user_name = user.email;
    user.full_name = _.startCase([user.first_name, user.last_name].filter(Boolean).join(' '));

    next();
});

export default mongoose.model('User', UserSchema);