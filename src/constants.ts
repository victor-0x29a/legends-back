export const isDevelopmentEnvironment = process.env.NODE_ENV === 'dev'
export const isTestingEnvironment = process.env.NODE_ENV === 'test'
export const isEnableLogging = isDevelopmentEnvironment
