export interface AuthResponse {
  jwt: string;
  email: string;
  id: BigInteger;
  roles: [string];
  username: string;
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface ScoreRange {
  id: number;
  minScore: number;
  maxScore: number;
  weight: number;
}

export interface Requirement {
  id: number;
  name: string;
  type: string;
}

export interface ProgramRequirement {
  id?: number;
  requirement: Requirement;
  condition: "AND" | "OR"; // Enforcing the condition to only be 'AND' or 'OR'
  scoreRanges: ScoreRange[]; // Updated to include scoreRanges
  score?: number; // Optional property if calculated or legacy
}

export interface Program {
  id: number;
  name: string;
  description: string;
  programRequirements: ProgramRequirement[]; // Updated to reference ProgramRequirement
}

export interface ProgramsResponse {
  programs: Program[]; // List of programs
}
