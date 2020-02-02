'use strict';
const async = require('async');
const _ = require('underscore');
const request = require('request');

const Helpers = require('../Support/helpers');

exports.testing = (req, res)=>{
    console.log("testing the route:: ",Date.now());
}

exports.acceptFollowRequest = (req, res)=>{
    console.log('Inside the accept folllow request');
    let requestedData = req.body;
    console.log('Passed Data:: ', requestedData);

    async.waterfall([
        (_next)=>{
            let msg = '';
            if(_.isUndefined(requestedData.session)){
                msg ='session required, pass the valid session.';
                _next(msg, null);
            } else if(_.isUndefined(requestedData.userAgent)){
                msg = 'user-agent required, pass the valid user-agent.';
                _next(msg, null);
            } else{
                _next(null, requestedData);
            }
        },
        (data, _next)=>{
            console.log('Data in the 2nd waterfall function:: ', data);
            // unirest
            //     .get('https://www.instagram.com/accounts/activity/?__a=1&include_reel=true')
            //     .headers({'Accept': '*/*',
            //     'cookie': requestedData.session, 'user-agent': requestedData.userAgent
            //     })
            //     .then(function (response) {
            //         console.log(response.body)
            //     })

            var postOptions = {
                url: 'https://www.instagram.com/accounts/activity/?__a=1&include_reel=true',
                headers:{
                    accept : '*/*',
                    cookie: data.session,
                    'user-agent': data.userAgent
                }
            };

            request(postOptions, (err, response, body)=>{
                console.log('Error:: ', err);
                console.log('response:: ', response);
                
                // console.log('Body:: ', body);
                if(!err){
                    if(response.statusCode == 200){
                        _next(null, body);
                    } else{
                        _next(body, null);
                    }

                } else {
                    console.log('Error: ', err);
                    _next(err, null);
                }
            });
        },
        (nextData, next)=>{
            console.log('Data inside the 3rd waterfall function:', typeof nextData);
            let friend_request_Data = (Helpers.isJSON(nextData)) ? JSON.parse(nextData) : nextData;
            console.log('Friend request data type:: ', typeof friend_request_Data);
            let requestProfileData = friend_request_Data.graphql.user.edge_follow_requests.edges;
            console.log('Username of the profile1 :: ', requestProfileData);
            // console.log('Username of the profile2 :: ',  friend_request_Data.graphql);
            async.forEachSeries(requestProfileData, function (userData, callback){
                console.log('Username :: ', userData.node.username);
                setTimeout(()=>{
                    let postOptions = {
                        url: 'https://www.instagram.com/web/friendships/'+userData.node.id+'/approve/',
                        proxy: (!_.isUndefined(requestedData.proxy))? requestedData.proxy : '',
                        headers: {
                            // 'accept-language': 'en-US,en;q=0.9',
                            // 'content-type': 'application/x-www-form-urlencoded',
                            cookie: requestedData.session,
                            // origin: 'https://www.instagram.com',
                            'user-agent': requestedData.userAgent,
                            // 'x-ig-app-id': 936619743392459
                        }
                    };
                    console.log('Post options for request approved ::', postOptions);
                    request.post(postOptions, (err, response, body)=>{
                        console.log('Errorin request approved:: ', err);
                        console.log('body request approved:: ', body, typeof body);

                        if(!err){
                            if(Helpers.isJSON(body)){
                                if(JSON.parse(body).status == 'ok'){
                                    callback();
                                } else {
                                    callback();
                                }
                            } else {
                                if(body.status == 'ok'){
                                    callback();
                                } else{
                                    callback();
                                }
                            }

                        } else{
                            callback();
                        }
                    });
                },_.random(20,50)*1000);
                callback();
            },function(err){
                if(err){
                    console.log('Errror:: ', err);
                    next(err, {error: err, msg: 'Follow request not approved.'});
                } else {
                    next(null, {msg: 'All follow request approved.'});
                }
            })
            // next(null, nextData);
        }
    ], (err, result)=>{
        if(!err){
            console.log('Type of the result:: ', typeof result);
            res.status(200).json({
                statusCode:200,
                status: 'success',
                result: (Helpers.isJSON(result)) ? JSON.parse(result)  : result
            });
        } else{
            console.log('Error in final block:: : ',err);
            res.status(200).json({
                statusCode: 400,
                status: 'failed',
                msg: err
            })
        }
    });
}