import Emitter from './Emitter'
import Socket from 'socket.io-client'

export default class{

    constructor(connection) {

        if(typeof connection == 'string'){
            this.Socket = Socket(connection);
        }else{
            this.Socket = connection
        }

        this.onEvent()

    }

    onEvent(){
        if (this.Socket instanceof Array) {
            for (const socket of this.Socket) {
                socket.onevent = (packet) => {
                    Emitter.emit(packet.data[0], packet.data[1])
                }
            }
        } else {
            this.Socket.onevent = (packet) => {
                Emitter.emit(packet.data[0], packet.data[1])
            }
        }

        const _this = this;
        const defaultEvents = ["connect", "error", "disconnect", "reconnect", "reconnect_attempt", "reconnecting", "reconnect_error", "reconnect_failed"];
        defaultEvents
            .forEach((value) => {
                if (_this.Socket instanceof Array) {
                    for (const socket of _this.Socket) {
                        socket.on(value, (data) => {
                            if (socket.name) {
                                Emitter.emit(`${socket.name}_${value}`, data)
                            } else {
                                Emitter.emit(value, data);
                            }
                        })
                    }
                } else {
                    _this.Socket.on(value, (data) => {
                        Emitter.emit(value, data)
                    })
                }
            })
    }

}