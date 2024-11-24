export interface AuthResponse {
    jwt: string,
    email: string,
    id: BigInteger
    roles: [string],
    username: string
}

export interface LoginFormData {
    email: string;
    password: string;
}

export interface Requirement {
  id: number;
  requirement: {
    id: number;
    name: string;
    type: string;
  };
  score: number;
}

export interface Program {
  id: number;
  name: string;
  description: string;
  programRequirements: Requirement[];
}

export interface ProgramsResponse {
  programs: Program[];
}