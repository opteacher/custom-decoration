import { gnlCpy } from '@lib/utils'

type NumOrAll = number | '*'

export default class Auth {
  addable: boolean
  deletable: boolean
  updatable: boolean
  queriable: boolean
  canAddNum: NumOrAll
  canDelRows: [NumOrAll, NumOrAll][]
  canUpdRowCells: [NumOrAll, NumOrAll][]
  canQryRowCells: [NumOrAll, NumOrAll][]

  constructor() {
    this.addable = true
    this.deletable = true
    this.updatable = true
    this.queriable = true
    this.canAddNum = '*'
    this.canDelRows = [[0, '*']]
    this.canUpdRowCells = [['*', '*']]
    this.canQryRowCells = [['*', '*']]
  }

  reset() {
    this.addable = true
    this.deletable = true
    this.updatable = true
    this.queriable = true
    this.canAddNum = '*'
    this.canDelRows = [[0, '*']]
    this.canUpdRowCells = [['*', '*']]
    this.canQryRowCells = [['*', '*']]
  }

  static copy(src: any, tgt?: Auth, force = false): Auth {
    return gnlCpy(Auth, src, tgt, { force })
  }
}
