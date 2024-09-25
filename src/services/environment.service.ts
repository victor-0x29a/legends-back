import { EnvironmentService, EnvironmentVars } from "../interfaces";

class Environment implements EnvironmentService {
    constructor (private readonly environmentVars: EnvironmentVars) {}

    getIsDevelopmentEnvironment(): boolean {
        return this.environmentVars.NODE_ENV === 'dev'
    }

    getIsTestingEnvironment(): boolean {
        return this.environmentVars.NODE_ENV === 'test'
    }

    getIsProductionEnvironment(): boolean {
        return this.environmentVars.NODE_ENV === 'prod'
    }

    getIsEnableLogging(): boolean {
        return this.getIsDevelopmentEnvironment()
    }

    getPort(): number {
        return Number(this.environmentVars.PORT)
    }

    getApplicationSecret(): string {
        return String(this.environmentVars.JWT_SECRET)
    }
}

export {
    Environment
}
