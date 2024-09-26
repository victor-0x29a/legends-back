import { EnvironmentVars } from "../interfaces";
import { Environment } from "./environment.service";

const getServiceInstance = (vars: EnvironmentVars) => new Environment(vars)
const getEnvVar = (key: string, value: string) => ({ [key]: value }) as unknown as EnvironmentVars

describe('test all service features', () => {
    test('should it returns true when is dev environment', () => {
        const envVars = getEnvVar('NODE_ENV', 'dev')
        expect(getServiceInstance(envVars).getIsDevelopmentEnvironment()).toBe(true)
    })
    test('should it returns false when is not dev environment', () => {
        const envVars = getEnvVar('NODE_ENV', 'homolog')
        expect(getServiceInstance(envVars).getIsDevelopmentEnvironment()).toBe(false)
    })
    test('should it returns true when is test environment', () => {
        const envVars = getEnvVar('NODE_ENV', 'test')
        expect(getServiceInstance(envVars).getIsTestingEnvironment()).toBe(true)
    })
    test('should it returns false when is not test environment', () => {
        const envVars = getEnvVar('NODE_ENV', 'development')
        expect(getServiceInstance(envVars).getIsTestingEnvironment()).toBe(false)
    })
    test('should it returns true when is prod environment', () => {
        const envVars = getEnvVar('NODE_ENV', 'prod')
        expect(getServiceInstance(envVars).getIsProductionEnvironment()).toBe(true)
    })
    test('should it returns false when is not test environment', () => {
        const envVars = getEnvVar('NODE_ENV', 'prod2')
        expect(getServiceInstance(envVars).getIsProductionEnvironment()).toBe(false)
    })
    test('should is enabled logging when is development environment', () => {
        const envVars = getEnvVar('NODE_ENV', 'dev')
        const service = getServiceInstance(envVars)
        expect(service.getIsDevelopmentEnvironment()).toBe(true)
        expect(service.getIsEnableLogging()).toBe(true)
    })
    test('should get the app port', () => {
        const envVars = getEnvVar('PORT', '3333')
        const service = getServiceInstance(envVars)
        expect(service.getPort()).toBe(3333)
    })
    test('should get the app secret', () => {
        const key = '--key--'
        const envVars = getEnvVar('JWT_SECRET', key)
        const service = getServiceInstance(envVars)
        expect(service.getApplicationSecret()).toBe(key)
    })
})
