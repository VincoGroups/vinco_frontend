import React from 'react';
import generateId from '../../../../ServerSide/generate';
import firebase from '../../../../ServerSide/basefile';
import Loadingblue from '../../../../NonAuth/Comps/Loadingblue'
import Stomp from 'stompjs';
import SockJS from 'sockjs-client';
let stompClient = null;
class Mainchat extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            message: '',
            messageres: [],
            currentStomp: '',
            messageplatform: false,
            loading: true
        }
    }

    _isMounted = false;

    componentDidMount() {
     this._isMounted = true;
     setTimeout(() => {
         fetch('/api/mainchatid/getmainchatmessages/' + this.props.grouptype + '/' + this.props.groupid + '/' + this.props.mainchatid)
         .then((res) => {
             return res.json();
         }).then((bod) => {
            if (this._isMounted) {
                this.setState({
                    messageres: bod
                })
            }
         }).catch((error) => {
             console.log(error);
         })
     }, 500);
     const socket = new SockJS('/mainchat-socket');
     stompClient = Stomp.over(socket);
     stompClient.connect({} , (frame) => {
        stompClient.subscribe('/chat/' + this.props.grouptype + '/' + this.props.groupid + '/' + this.props.mainchatid, (message) => {
            this.state.messageres.push(JSON.parse(message.body));
            this.setState({
                messageres: this.state.messageres
            })
        })
        this.setState({
            messageplatform: true,
            loading: false
        })
     }, () => {
        this.setState({
            messageplatform: false,
            loading: false
        })
     })

     stompClient.debug = null;
    }

    componentWillUnmount() {
        if (stompClient !== null) {
            stompClient.unsubscribe()
        }
    }

    PostMessage =  () => {
        const data = {
            message: this.state.message,
            messageid: generateId(62),
            displayname: firebase.auth().currentUser.displayName,
            date: new Date()
        }

        stompClient.send('/vincoapp/mainchat/' + this.props.grouptype + '/' + this.props.groupid + '/' + this.props.mainchatid , {} , JSON.stringify(data));
        
    }

    MessageComponents = () => {
        return (
            <div >
            {
                this.state.messageres.map(item => (
                    <div key={this.state.messageres.indexOf(item)}>
                        <div className="comment-container">
                        <h6 className="comment d-inline-flex p-2">{item.displayname + ': ' + item.message}</h6>
                        </div>
                    </div>
                ))
            }
            </div>
        )
    }

    MessagePlatform = ({messageplatform}) => {
        if (messageplatform === true) {
            return (
                <div>
                <div className="chat-message-component">
                <h3>Main Chat</h3>
                <div className="message-output">
                  <this.MessageComponents/>
                </div>
                <input type="text" className="input-comment-blue" name="message" onChange={(e) => {
                    this.setState({
                        [e.target.name]: e.target.value
                    })
                }} placeholder="Comment here..."
                onKeyDown={(e) => {
                    if (e.keyCode === 13) {
                        this.PostMessage();
                    }
                }}/>
                </div>
                </div>
            )
        } else if (messageplatform === 'error') {
            return (
                <div>
                <div className="modal-padding">
                  <h1 className="text-center">THERE WAS AN ERROR TO YOUR CONNECTION PLEASE REFRESH</h1>
                </div>
                </div>
            )
        } else {
            return (
                <div>
                  <Loadingblue loading={this.state.loading}/>
                </div>
            )
        }
    }
    render () {
        console.log(this.state)
        return (
            <div>
             <this.MessagePlatform messageplatform={this.state.messageplatform}/>
            </div>
        )
    }
}

const MainChatShow = ({mainchatshow , groupname , mainchatid , grouptype, groupid}) => {
    if (mainchatshow === true) {
        return (
            <div>
            <div className="group-page">
            <Mainchat 
              groupname = {groupname}
              mainchatid={mainchatid} 
              grouptype={grouptype}
              groupid={groupid}
              />
            </div>
            </div>
        )
    } else {
        return null;
    }
}

export default MainChatShow