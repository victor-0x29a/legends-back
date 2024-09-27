import type { Router, Request } from 'express'

export type Controller = [Router, string]
export type BaseRequest<T = any, K = any, Y = any> = Request<K, Y, T>
