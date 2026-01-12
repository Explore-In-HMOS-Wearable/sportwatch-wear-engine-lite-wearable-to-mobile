import {
    Builder, Message, P2pClient
} from '../wearenginesdk/wearengine'; // After downloading the wear engine file for lite wearable from the place it, please check readme.
import app from '@system.app';
import { PHONE_APP_FINGERPRINT, PHONE_APP_PACKAGE_NAME } from '../../constants/constants.js';
import brightness from '@system.brightness';

let p2pClient = new P2pClient();
let MessageClient = new Message();
let builderClient = new Builder();

export default {
    data: {
        receiveMessage: '',
        receivedMessage: '',
        infoMessage: ''
    },
    onInit() {
        this.keepScreenOn(); // so that the screen doesn't turn off during the test
        p2pClient.setPeerPkgName(PHONE_APP_PACKAGE_NAME);
        p2pClient.setPeerFingerPrint(PHONE_APP_FINGERPRINT);
        this.registerMessage()
    },
    registerMessage() {
        let that = this;
        p2pClient.registerReceiver({
            onSuccess: function () {
                that.receiveMessage = 'Message receive success';
            },
            onFailure: function () {
                that.receiveMessage = 'Message receive fail';
            },
            onReceiveMessage: function (data) {
                if (data && data.isFileType) {
                    that.receiveMessage = `Receive file name:${data.name}`;
                } else {
                    that.receiveMessage = `Receive message:${data.data}`;
                    that.receivedMessage = data;
                    console.info(`Received message: ${that.receivedMessage}`);
                }
            }
        });
    },
    unregisterMessage() {
        let that = this;
        p2pClient.unregisterReceiver({
            onSuccess: function () {
                that.infoMessage = 'Stop receiving messages is sent';
            }
        });
    },
    sendMessage() {
        builderClient.setDescription('hello wearEngine');
        MessageClient.builder = builderClient;
        this.infoMessage = 'Send message button click';
        console.info(`testBuilder: ${MessageClient.getData()}`);

        let that = this;
        p2pClient.send(MessageClient, {
            onSuccess: function () {
                that.infoMessage = 'Message sent successfully';
            },
            onFailure: function () {
                that.infoMessage = 'Failed to send message';
            },
            onSendResult: function (resultCode) {
                console.info(`On send result data: ${resultCode.data}, result code ${resultCode.data}`);

            },
            onSendProgress: function (progressNum) {
                console.info(`Send Progress: ${progressNum}`);
            }
        });
    },

    keepScreenOn() {
        brightness.setKeepScreenOn({
            keepScreenOn: true,
            success: function () {
                console.info('screen on success');
            },
            fail: function () {
                console.info('screen on failed');
            }
        })
        brightness.setValue({
            value: 180,
            success: function () {
                console.info('handling set brightness success.');
            },
            fail: function (data, code) {
                console.error(`Handling set brightness value fail, code:: ${code}, result code ${data}`);

            }
        });
    },

    sendFile() {
        this.infoMessage = 'Send file button click';
        let testFile = {
            // File path. If the file fails to be sent and the result code is 208,
            // it indicates that the wearable version is too early. In this case, instruct users to update the version.
            'name': 'internal://app/rawfile/file.txt',
            'mode': 'text', // File type, 'text' or 'binary'
            'mode2': 'RW', // File attribute, 'R', 'W', or 'RW'
        };
        let that = this;

        builderClient.setPayload(testFile);
        MessageClient.builder = builderClient;
        p2pClient.send(MessageClient, {
            onSuccess: function () {
                that.infoMessage = 'File sent successfully';
            },
            onFailure: function () {
                that.infoMessage = 'Failed to send file';
            },
            onSendResult: function (resultCode) {
                console.info(`Send file result data: ${resultCode.data}, code: ${resultCode.code}`);
                if (resultCode.code === 207) {
                    that.infoMessage = 'Success sent file'
                    return
                }
                that.infoMessage = resultCode.code;
            },
            onSendProgress: function (count) {
                console.info(`Progress: ${count}`);
                that.infoMessage = `Progress: ${count}`
            }
        });
    },
    ping() {
        let that = this;
        that.infoMessage = 'Ping correct APP';
        p2pClient.ping({
            onSuccess: function () {
                that.infoMessage = `${that.infoMessage}success`;
            },
            onFailure: function () {
                that.infoMessage = `${that.infoMessage}fail`;
            },
            onPingResult: function (resultCode) {
                that.infoMessage = `result code${resultCode.code}, the app already have installed`;
            }
        });
    },
    swipeEvent(e) {
        if (e.direction === 'right') {
            app.terminate();
        }
    }
}