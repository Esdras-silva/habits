declare namespace Express{
  export interface Request{
    user: {
      sub: string;
      name: string;
      avatarUrl?: string;
      email: string;
    }
  }
}