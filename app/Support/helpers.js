'use strict';
const _ = require('underscore');

let Helpers = {};

Helpers.isJSON = (data)=>{
    try{
        var a = JSON.parse(data);
        return true;
    } catch(e){
        return false
    }
}

Helpers.generateHttpRequest = (data)=>{
    console.log('inside create Http request');
    let device = (this.isJSON(data.device)) ? JSON.parse(data.device): data.device;
    console.log('Device :: ', device, typeof device);

    var postOption = {
        url: data.url,
        proxy: (!_.isUndefined(data.proxy) ? data.proxy: ''),
        headers: {
            'X-Pigeon-Session-Id': device.pSession,
            'X-Pigeon-Rawclienttime': Math.floor(Date.now() / 1000),
            'X-IG-Connection-Speed': '-1kbps',
            'X-IG-Bandwidth-Speed-KBPS': _.random(1000,9999)+'kbps',
            'X-IG-Bandwidth-TotalBytes-B': 0,
            'X-IG-Bandwidth-TotalTime-MS': 0,            
            'X-IG-Connection-Type': 'WIFI',
            'X-IG-Capabilities': '3brTvwE=',
            'X-IG-App-ID': 567067343352427,
            'Accept-Language': 'en-US',            
            'X-FB-HTTP-Engine': 'Liger',
            'X-Bloks-Version-Id': '0a3ae4c88248863609c67e278f34af44673cff300bc76add965a9fb036bd3ca3',
            'X-Bloks-Is-Layout-RTL': false,
            'X-IG-Device-Locale': 'en_US',
            'X-IG-Device-ID': device.guid,
            'X-IG-Android-ID': device.androidDeviceId,        
            'User-Agent': device.user_agent,
            'Content-Type': 'application/x-www-form-urlencoded',
            Host: 'i.instagram.com',
           
        }
    };

    postOption['headers']['Cookie'] = data.session;
    if(!_.isUndefined(data.formData)){
        postOption['form'] = data.formData
    }

    return postOption;
}



module.exports = Helpers;