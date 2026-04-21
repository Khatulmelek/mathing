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
      a = getRandomInt(1, 99)
      b = getRandomInt(1, 99)
      answer = a + b
      break
    case '-':
      a = getRandomInt(10, 99)
      b = getRandomInt(1, a) // Ensure positive result
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
