/**
 * Created by Muc on 17/2/21.
 */
module.exports = {
    port: 3003,
    session: {
        secret: 'apiTest',
        key: 'apiTest',
        maxAge: null
    },
    mongodb: 'mongodb://localhost:27017/restful_api_test',
    token:{
        exp:60*60,
        key:"secret"
    }
};