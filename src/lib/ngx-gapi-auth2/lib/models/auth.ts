export class AuthUser {
  constructor(
    public id: string,
    public firstName: string,
    public lastName: string,
    public email: string,
    public avatar: string,
    public idToken: string,
    public tokenExpiresAt: number
  ) { }
}
