import http from 'node:http';
import { Transform } from 'node:stream';

class InverseNumber extends Transform {
    _transform(chunck, encoding, callback) {
        const transformed_number = Number(chunck.toString()) * -1;

        console.log(transformed_number);

        callback(null, Buffer.from(String(transformed_number)))
    }
}

const server = http.createServer(async (req, res) => {
    const buffers = []

    for await(const chunck of req) {
        buffers.push(chunck)
    }

    const fullStreamContent = Buffer.concat(buffers).toString()

    console.log(fullStreamContent)

    return res.end(fullStreamContent);
});

server.listen(3334);