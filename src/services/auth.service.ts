import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import type { User } from '../models'
import { InternalValidation } from '../web/errors'

class Auth {
    userData: User | null = null

   constructor (private readonly applicationSecret: string = '') {}

    set user (userData: User) {
        this.userData = userData
    }

    get tokenPayload () {
        return {
            id: this.userData.id,
            username: this.userData.username
        }
    }

    get tokenOptions () {
        return {
            expiresIn: '20min'
        }
    }

    public async getPasswordHash(plainPassword: string): Promise<string> {
        const salts = await bcrypt.genSalt()
        const passwordHash = await bcrypt.hash(plainPassword, salts)
        return passwordHash
    }

    public async comparePlainTextWithHash(plainText: string, hash: string): Promise<boolean> {
        const isEqual = await bcrypt.compare(plainText, hash)
        return isEqual
    }

    private validate(): void {
        const haventApplicationSecret = !this.applicationSecret
        const applicationSecretIsString = typeof this.applicationSecret === 'string'

        if (haventApplicationSecret || !applicationSecretIsString) {
            throw new InternalValidation('The application secret must be provided.')
        }
    }

   public signToken () {
    this.validate()

    return jwt.sign(this.tokenPayload, this.applicationSecret, this.tokenOptions)
   }
}

export { Auth }
