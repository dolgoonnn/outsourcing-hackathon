import type { ColumnType } from "kysely";
export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;
export type Timestamp = ColumnType<Date, Date | string, Date | string>;

export type Agent = {
  id: Generated<number>;
  type: string;
};
export type Answer = {
  id: Generated<number>;
  questionId: number;
  userId: number;
  content: string;
};
export type Project = {
  id: Generated<number>;
  userId: number;
  agentId: number;
  status: string;
};
export type Question = {
  id: Generated<number>;
  agentId: number;
  content: string;
};
export type Requirement = {
  id: Generated<number>;
  projectId: number;
  description: string;
};
export type User = {
  id: Generated<number>;
  name: string;
  email: string;
  password: string;
};
export type DB = {
  Agent: Agent;
  Answer: Answer;
  Project: Project;
  Question: Question;
  Requirement: Requirement;
  User: User;
};
