import { base64ToUtf8, utf8ToBase64 } from "./Base64Encoding";
import * as assert from 'assert';

describe('test sharedo_ide', function() {
    it('test sharedo_ide.utf8ToBase64', function(done) {
        assert.equal(utf8ToBase64('123'), 'MTIz');
        assert.equal(utf8ToBase64('1234'), 'MTIzNA==');
        done();
    })
})


describe('test sharedo_ide', function() {
    it('test sharedo_ide.base64ToUtf8', function(done) {
        let str = 'MTIzNA==';
        let ret = base64ToUtf8(str);
        assert.equal(ret, '1234');
        done();
    })
})