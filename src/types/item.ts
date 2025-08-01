import { gnlCpy } from "@lib/utils"

export default class Item {
  id: string
  name: string

  constructor() {
    this.id = ''
    this.name = ''
  }

  reset() {
    this.id = ''
    this.name = ''
  }

  static copy(src: any, tgt?: Item, force = false): Item {
    return gnlCpy(Item, src, tgt, { force })
  }
}