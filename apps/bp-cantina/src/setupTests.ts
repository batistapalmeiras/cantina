// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
// Libs
import '@testing-library/jest-dom';
// jsdom under the CRA/jest 27 runtime does not expose TextEncoder/TextDecoder,
// which react-router v7 requires at import time. Polyfill from Node's util.
import { TextDecoder, TextEncoder } from 'util';
// ...nor a global `crypto`; polyfill from Node's webcrypto so crypto.randomUUID works.
import { webcrypto } from 'crypto';

Object.assign(global, { TextEncoder, TextDecoder });
if (!global.crypto) Object.assign(global, { crypto: webcrypto });