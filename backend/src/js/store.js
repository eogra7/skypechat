import { store } from "react-easy-state";
import api from './api';

// eslint-disable-next-line
const chatStore = store({
    isLoggedIn: false,
    isAdmin: false,
    user: {
        name: ' '
    },
    chats: [{
        topic: '',
        messages: []
    }],
    replies: [],
    openReply: false,
    currentChatId: undefined,
    currentChat: () => {
        let ret = undefined;
        chatStore.chats.forEach(chat => {
            if(chat._id === chatStore.currentChatId) ret = chat;
        });
        return ret;
    },
    async fetchChats() {
        api.get('/api/chats').then(async r => {
            if (r.ok) {
                const data = await r.json();
                const newData = data.data.map((chat) => {
                    if(chat.topic == null) {
                        chat.topic = chat.cid;
                    }
                    return chat;
                })
                let countOld = 0;
                chatStore.chats.forEach(chat => {
                    countOld = countOld + chat.messages.length;
                })
                let countNew = 0;
                data.data.forEach(chat => {
                    countNew = countNew + chat.messages.length;
                })
                if(countOld !== countNew) {
                    chatStore.chats = newData;
                }
            }
        })
    },
    async fetchUsers() {
        api.get('/api/list-users').then(async r => {
            if(r.ok) {
                const data = await r.json();
                chatStore.users = Array.from(data.users);
            }
        })
    },
    async fetchReplies() {
        let r = await api.get('/api/get-replies');
        if(r.ok) {
            const data = await r.json();
            chatStore.replies = data.data;
        }
    },
    interval: setInterval(() => {
        chatStore.fetchChats();
    }, 2000)
})

export default chatStore;