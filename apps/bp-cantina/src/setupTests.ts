// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
// Libs
import '@testing-library/jest-dom';
// jsdom under the CRA/jest 27 runtime does not expose TextEncoder/TextDecoder,
// which react-router v7 requires at import time. Polyfill from Node's util.
import { TextDecoder, TextEncoder } from 'util';

Object.assign(global, { TextEncoder, TextDecoder });