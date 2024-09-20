import { EnvironmentVars } from "../interfaces";
import { EnvironmentService } from "../services";

class BaseController extends EnvironmentService {
    constructor() {
        super(process.env as unknown as EnvironmentVars)
    }
}

export default BaseController
