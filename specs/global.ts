import WebCore from '../src/web/core';
import express from 'express';

export const app = new WebCore(3000, express()).app;
