import { Readable, Writable, Transform } from 'node:stream'

class OneToOneHundred extends Readable {
    index = 1;

    _read() {
        setTimeout(() => {
            const i = this.index++;

            if (i > 100) {
                this.push(null);
            } else {
                const buf = Buffer.from(String(i));

                this.push(buf);
            }
        }, 500);
    }
}

class InverseNumber extends Transform {
    _transform(chunck, encoding, callback) {
        const transformed_number = Number(chunck.toString()) * -1;
        callback(null, Buffer.from(String(transformed_number)))
    }
}

class MultiplyByTen extends Writable {
    _write(chunck, encoding, callback) {
        console.log(Number(chunck.toString()) * 10);
        callback();
    }
}

new OneToOneHundred()
    .pipe(new InverseNumber())
    .pipe(new MultiplyByTen())