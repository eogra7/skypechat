interface DataChannel {
    subscribers: any[];
    subscribe(callback: () => void);
    emit();
    
}

const _DataChannel: DataChannel = {
    subscribers: [],
    subscribe(callback: (data) => void) {
        this.subscribers.push(callback);
    },
    emit() {
        this.subscribers.forEach(value => {
            value({
                chats: true
            })
        })
    }

}

export default _DataChannel;
