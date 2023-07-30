const Constants = require('./Constants');

class Util {
    static isToken(query, type = 'user') {
        let regexp = Constants.RegExp[type];
        return regexp.test(query);
    }
    static verifyValue(value, data) {
        if (!value || !data) return value == data;
        return value.toLowerCase() == data.toLowerCase() || value.toLowerCase().includes(data.toLowerCase());
    }
    static checkType(value, type, opt) {
        if (opt && value == undefined) return true;
        return typeof value == type || value.constructor.name == type;
    }
    static isNotEmptyObj(data) {
        if (data == undefined) {
            return false;
        } else if (Array.isArray(data)) {
            if (data.length <= 0) return false;
            if (!data.every(i => this.isNotEmptyObj(i))) return false;
        } else if (data.constructor == Object) {
            if (!this.isNotEmptyObj(Object.keys(data))) return false;
            for (const k of Object.keys(data)) {
                if (!this.isNotEmptyObj(data[k])) return false;
            }
        }
        return true;
    }
    static userPartialData(data) {
        const options = {
            "username": data.maybe_creator_username ?? data.creator_username,
            "display_name": data.maybe_creator_display_name ?? data.creator_display_name,
            "user_token": data.maybe_creator_user_token ?? data.creator_user_token,
            "gravatar_hash": data.maybe_creator_gravatar_hash ?? data.creator_gravatar_hash,
        }
        return options;
    }
    static modelPartialData(data) {
        const options = {
            "model_token": data.tts_model_token,
            "title": data.tts_model_title,
            "creator_username": data.maybe_model_creator_username,
            "creator_user_token": data.maybe_model_creator_user_token,
            "creator_display_name": data.maybe_model_creator_display_name,
            "creator_gravatar_hash": data.maybe_model_creator_gravatar_hash,
        }
        return options;
    }
    static __isNotChanges(data, newData) {
        const arrayOptions = [['cashapp', 'discord', 'github', 'patreon',
            'twitter', 'twitch', 'website'], ['ttsVisibility', 'w2lVisibility']];
        for (const key in newData) {
            if (arrayOptions[0].includes(key)) {
                if (data[key] !== newData[key]) return false;
            }
            if (arrayOptions[0].includes(key)) {
                if (Boolean(data[key]) !== Boolean(newData[key])) return false;
            }
        }
        return true;
    }
    static __getHeaders(client) {
        let options = {};
        if (client.session.token) {
            options['Authorization'] = client.session.token;
        }
        if (client.session.auth) {
            // options['Cookie'] = `session=${client.session.auth}`;
            options['Authorization'] = `session=${client.session.auth}`;
        }
        return options;
    }
};

module.exports = Util;

// if (client.session.auth) {
//     options['Cookie'] = `session=eyJhbGciOiJIUzI1NiJ9.eyJjb29raWVfdmVyc2lvbiI6IjIiLCJzZXNzaW9uX3Rva2VuIjoiU0VTU0lPTjo3d3ExcmUzdnY4cjduOTM0Z2Zmd3FiOXgiLCJ1c2VyX3Rva2VuIjoiVToyRVlRS1dBSzBQTVk0In0.VmCMwM1DdK5M0Kwt7yLo6PkOmA3xns_3ruqEj12Ik_c; _ga=GA1.1.2015365413.1690146651; _ga_NYQF9CWFH4=GS1.1.1690264565.2.1.1690264586.39.0.0; _ga_06ZXE5FTP6=GS1.1.1690294346.6.1.1690294494.0.0.0; _ga_525G5MXFJG=GS1.1.1690310184.4.1.1690311625.16.0.0; ph_phc_x6IRdmevMt4XAoJqx9tCmwDiaQkEkD48c0aLmuXMOvu_posthog=%7B%22distinct_id%22%3A%22promtwizard%22%2C%22%24device_id%22%3A%2201898d25-2891-71a1-9cb0-8374cacb4e6c%22%2C%22%24user_state%22%3A%22identified%22%2C%22%24sesid%22%3A%5B1690311631122%2C%2201898d25-2894-78a4-b079-4e355f41ac83%22%2C1690290170004%5D%2C%22%24session_recording_enabled_server_side%22%3Atrue%2C%22%24console_log_recording_enabled_server_side%22%3Atrue%2C%22%24session_recording_recorder_version_server_side%22%3A%22v2%22%2C%22%24autocapture_disabled_server_side%22%3Afalse%2C%22%24active_feature_flags%22%3A%5B%5D%2C%22%24enabled_feature_flags%22%3A%7B%7D%2C%22%24feature_flag_payloads%22%3A%7B%7D%2C%22%24user_id%22%3A%22promtwizard%22%2C%22%24stored_person_properties%22%3A%7B%7D%7D`;
// }