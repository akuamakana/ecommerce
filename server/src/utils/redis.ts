import Redis from 'ioredis';
import testRedis from 'ioredis-mock';

/* istanbul ignore next */
const redis = process.env.NODE_ENV === 'test' ? new testRedis() : new Redis();

export default redis;
