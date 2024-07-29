import { Readable } from 'node:stream'

class OneToOneHundred extends Readable {
    index = 1;

    _read() {
        const i = this.index++;

        setTimeout(() => {
            if (i > 100) {
                this.push(null);
            } else {
                const buf = Buffer.from(String(i));

                this.push(buf);
            }
        }, 150);
    }
}

fetch('http://localhost:3334', {
    method: 'POST',
    body: new OneToOneHundred(),
    duplex: 'half' 
}).then(response => {
    return response.text()
}).then(text => {
    console.log(text)
})