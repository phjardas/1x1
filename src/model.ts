export type Operator = "+" | "*";

const unknowns = ["operand1", "operand2", "result"] as const;
export type Unknown = (typeof unknowns)[number];

export type Problem = {
  id: string;
  operator: Operator;
  operand1: number;
  operand2: number;
  result: number;
  unknown: Unknown;
};

export type ProblemSpec = {
  operators: readonly Operator[];
  minOperandValue: number;
  maxOperandValue: number;
};

export function createProblems(
  spec: ProblemSpec,
  count: number
): readonly Problem[] {
  const seen = new Set<string>();
  const problems: Problem[] = [];

  while (problems.length < count) {
    const problem = createProblem(spec);
    if (!seen.has(problem.id)) {
      problems.push(problem);
      seen.add(problem.id);
    }
  }

  return problems;
}

function createProblem(
  spec: ProblemSpec,
  random: () => number = Math.random
): Problem {
  const operator = spec.operators[Math.floor(random() * spec.operators.length)];
  const unknown = unknowns[Math.floor(random() * unknowns.length)];
  const operand1 =
    spec.minOperandValue +
    Math.floor(random() * (spec.maxOperandValue - spec.minOperandValue + 1));
  const operand2 =
    spec.minOperandValue +
    Math.floor(random() * (spec.maxOperandValue - spec.minOperandValue + 1));
  const result = calculate(operator, operand1, operand2);

  return withId({
    operator,
    operand1,
    operand2,
    result,
    unknown,
  });
}

function calculate(
  operator: Operator,
  operand1: number,
  operand2: number
): number {
  switch (operator) {
    case "+":
      return operand1 + operand2;
    case "*":
      return operand1 * operand2;
  }
}

function withId(problem: Omit<Problem, "id">): Problem {
  const id = `${problem.operand1}${problem.operator}${problem.operand2}=${problem.result}`;
  return { ...problem, id };
}
