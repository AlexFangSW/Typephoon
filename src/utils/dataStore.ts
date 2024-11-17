type GraphDot<Tx, Ty> = {
  x: Tx
  y: Ty
}

type SoloResultPage = {
  wpm: number
  acc: number
  graphWPM: GraphDot<number, number>[]
  graphWPMRaw: GraphDot<number, number>[]
  graphErrors: GraphDot<number, number>[]
}

let soloResultPage: SoloResultPage = {
  wpm: 90,
  acc: 95,
  graphWPM: [{ x: 123, y: 123 }],
  graphWPMRaw: [],
  graphErrors: []
}

export default { soloResultPage }
