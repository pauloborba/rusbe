import User from './user';

export default class Suggestion {
    id: string;
    content: string;
    author: User;
    timestamp: Date;
}