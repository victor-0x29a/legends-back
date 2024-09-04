export interface EnvironmentVars {
    PORT: number
    JWT_SECRET: string
    NODE_ENV: 'dev' | 'test' | 'prod'
}

export interface EnvironmentService {
    getIsDevelopmentEnvironment(): boolean
    getIsTestingEnvironment(): boolean
    getIsProductionEnvironment(): boolean
    getIsEnableLogging(): boolean
    getPort(): number
}
