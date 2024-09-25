class LegendHttpError extends Error {
  constructor(public status: number, public message: string) {
    super(message);
  }
}

class InternalValidation extends Error {
  constructor(public message: string) {
    super(message)
  }
}

export { LegendHttpError, InternalValidation }
