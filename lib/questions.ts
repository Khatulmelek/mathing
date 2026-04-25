export interface Question {
  id: string
  expression: string
  answer: number
}

type Operation = '+' | '-' | '*'

function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export function generateQuestion(): Question {
  const operations: Operation[] = ['+', '-', '*']
  const operation = operations[getRandomInt(0, 2)]

  let a: number, b: number, answer: number

  switch (operation) {
    case '+':
      //   a = getRandomInt(1, 99)
      //   b = getRandomInt(1, 99)
      switch (getRandomInt(0, 1)) {
        case 0:
          a = getRandomInt(1, 10)
          b = getRandomInt(1, 10)
          break
        case 1:
          a = getRandomInt(1, 99)
          b = getRandomInt(Math.floor(a / 10), 9) * 10 - a
          break
        default:
          a = getRandomInt(1, 10)
          b = getRandomInt(1, 10)
      }
      answer = a + b
      break
    case '-':
      switch (getRandomInt(0, 2)) {
        case 0:
          a = getRandomInt(1, 20)
          b = getRandomInt(1, a)
          break
        case 1:
          b = getRandomInt(1, 99)
          a = getRandomInt(1, 9) * 10 + b
          break
        case 2:
          a = getRandomInt(10, 99)
          b = a - getRandomInt(0, 9)
        default:
          a = getRandomInt(1, 20)
          b = getRandomInt(1, a)
      }
      answer = a - b
      break
    case '*':
      a = getRandomInt(2, 12)
      b = getRandomInt(2, 12)
      answer = a * b
      break
  }

  return {
    id: crypto.randomUUID(),
    expression: `${a} ${operation} ${b}`,
    answer
  }
}
