//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
namespace egret.web {
    /**
     * @private
     */
    export class HTML5WebSocket implements ISocket {
        private socket;

        constructor() {
            if (!window["WebSocket"]) {
                egret.$error(3100);
            }
        }

        private onConnect:Function;
        private onClose:Function;
        private onSocketData:Function;
        private onError:Function;
        private thisObject:any;
        public addCallBacks(onConnect:Function, onClose:Function, onSocketData:Function, onError:Function, thisObject:any):void {
            this.onConnect = onConnect;
            this.onClose = onClose;
            this.onSocketData = onSocketData;
            this.onError = onError;
            this.thisObject = thisObject;
        }

        private host:string = "";
        private port:number = 0;
        public connect(host:string, port:number):void {
            this.host = host;
            this.port = port;

            let socketServerUrl = "ws://" + this.host + ":" + this.port;
            this.socket = new window["WebSocket"](socketServerUrl);
            this.socket.binaryType = "arraybuffer";
            this._bindEvent();
        }

        public connectByUrl(url:string):void {
            this.socket = new window["WebSocket"](url);
            this.socket.binaryType = "arraybuffer";
            this._bindEvent();
        }

        private _bindEvent():void {
            let that = this;
            let socket = this.socket;
            socket.onopen = function () {
                if (that.onConnect) {
                    that.onConnect.call(that.thisObject);
                }
            };
            socket.onclose = function (e) {
                if (that.onClose) {
                    that.onClose.call(that.thisObject);
                }
            };
            socket.onerror = function (e) {
                if (that.onError) {
                    that.onError.call(that.thisObject);
                }
            };
            socket.onmessage = function (e) {
                if (that.onSocketData) {
                    if(e.data){
                        that.onSocketData.call(that.thisObject, e.data);
                    }else{
                        //for mygame
                        that.onSocketData.call(that.thisObject, e);
                    }
                }
            };
        }

        public send(message:any):void {
            this.socket.send(message);
        }

        public close():void {
            this.socket.close();
        }
        public disconnect():void {
            if (this.socket.disconnect) {
                this.socket.disconnect();
            }
        }
    }

    ISocket = HTML5WebSocket;
}
