import jwt from 'jsonwebtoken'
import type { User } from '../models'
import { InternalValidation } from '../web/errors'

class Auth {
   constructor (private readonly userData: User, private readonly applicationSecret: string) {}

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
