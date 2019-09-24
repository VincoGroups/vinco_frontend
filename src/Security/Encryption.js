import SimpleCrypto from 'simple-crypto-js';

const key = SimpleCrypto.generateRandom(Math.floor(Math.random()*300));

export const SecurityConfig = (text) => {
    const cryption = new SimpleCrypto(key);

    return cryption.encrypt(text);
}

export const DecodeConfig = (text) => {
    const decode = new SimpleCrypto(key);
     
    return decode.decrypt(text);
}
