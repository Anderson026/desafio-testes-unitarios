
import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "./CreateUserUseCase";



let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;
describe("Create User", () => {

  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
  });

  it("should be able create a new user", async () => {
    const user = await createUserUseCase.execute({
      name: "Anderson",
      email: "anderson@gmail.com",
      password: "123456"
    });

    expect(user).toHaveProperty("id");
  });

  it("should not be able to register two users with same email", async () => {
    expect(async () => {
      await createUserUseCase.execute({
        name: "Anderson",
        email: "anderson@gmail.com",
        password: "123456"
      });

      await createUserUseCase.execute({
        name: "Anderson",
        email: "anderson@gmail.com",
        password: "123456"
      });
    }).rejects.toBeInstanceOf(AppError);
  })
});
