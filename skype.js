/*eslint indent: ["error", 4, { "SwitchCase": 1 }]*/
// @ts-check
import {
    Connection
} from './connection'
import DataChannel from './data-channel';
/* 
var conversationId = conversationLink.substring(conversationLink.lastIndexOf('/') + 1);
*/

function handleUriObject(resource) {

}

export function handleEvent(e) {
    if(e.resourceType === 'NewMessage') {
        if (e.resource.type === 'RichText' || e.resource.type === 'Text') {
            handleMessage(e.resource);
        } else if(e.resource.type.startsWith('Control')) {
            console.log('Ignored a Control/*');
            return;
        } else if(e.resource.type === 'RichText/UriObject') {
            handleUriObject(e.resource);
        } else {
            console.log('*** New Type of Event ***')
            console.log('handleEvent :', e);
        }
    } else if(e.resourceType === 'ConversationUpdate') {
        console.log('Ignored a ConversationUpdate');
        return;
    } else {
        console.log('*** New Type of Event ***');
        console.log('handleEvent :', e);
    }
}

function handleAddMember(message, chatMessage) {
    console.log(message);
    Connection.connectToMongo().then(async db => {
        const cLink = message.conversationLink;
        /** @type {ChatType} */
        const chat = {
            topic: message.threadtopic,
            cid: cLink.substring(cLink.lastIndexOf('/') + 1),
            assignedUsers: [],
            messages: [ chatMessage ]
        };
        db.collection('chats').insertOne(chat)
            .catch(reject => Error(reject));

    });
}

export function handleMessage(_message) {
    const message = _message.native;
    console.log('handleMessage: ');
    console.log(message);

    Connection.connectToMongo().then(async db => {
        // db.collection('messages').insertOne(message);
        const cLink = message.conversationLink;
        /** @type {ChatMessageType} */
        const chatMessage = {
            cid: cLink.substring(cLink.lastIndexOf('/') + 1),
            content: message.content,
            from: /.+\/\d:(.+)/.exec(message.from)[1],
            timestamp: Math.round(Date.now() / 1000)

        };
        // /** @type {ChatType} */
        // let r = await db.collection('chats').findOne({cid: chatMessage.cid});
        // let r = await db.collection('chats').findOneAndUpdate({
        //     'cid': chatMessage.cid
        // }, {
        //     '$addToSet': {
        //         'messages': chatMessage
        //     }
        // }, {
        //     'upsert': true
        // });
        // if (!r.ok) Error(r.lastErrorObject);
        let count = await db.collection('chats').countDocuments({
            'cid': chatMessage.cid
        }, {
                'limit': 1
            });
        if (count == 0) {
            handleAddMember(message, chatMessage);
        } else {
            db.collection('chats').findOneAndUpdate({
                cid: chatMessage.cid
            }, {
                    '$addToSet': {
                        'messages': chatMessage
                    }
                }).catch(rejects => Error(rejects));
        }

        DataChannel.emit();
    });
}
