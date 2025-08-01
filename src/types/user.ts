import { gnlCpy } from "@lib/utils"
import Auth from "./auth"

export default class User {
  name: string
  email: string
  password: string
  auth: Auth

  constructor() {
    this.name = ''
    this.email = ''
    this.password = ''
    this.auth = new Auth()
  }

  reset() {
    this.name = ''
    this.email = ''
    this.password = ''
    this.auth = new Auth()
  }

  static copy(src: any, tgt?: User, force = false): User {
    return gnlCpy(User, src, tgt, { force, cpyMapper: { auth: Auth.copy } })
  }
}