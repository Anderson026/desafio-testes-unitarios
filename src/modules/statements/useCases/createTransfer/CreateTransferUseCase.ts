import { container, inject, injectable } from "tsyringe";
import { AppError } from "../../../../shared/errors/AppError";
import { IUsersRepository } from "../../../users/repositories/IUsersRepository";
import { OperationType } from "../../entities/Statement";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";

interface IRequest {
  receiveUserId: string;
  senderUserId: string;
  amount: number;
  description: string;
}

injectable()
export class CreateTransferUseCase {

  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository
  ){}

  async execute({
    receiveUserId,
    senderUserId,
    amount,
    description
  }: IRequest): Promise<void> {
    if (amount <= 0) {
      throw new AppError("Amount must be greater than 0!");
    }

    const receiveUser = await this.usersRepository.findById(receiveUserId);

    if (!receiveUser) {
      throw new AppError("Receive user not found!");
    }

    const senderUser = await this.usersRepository.findById(senderUserId);

    if (!senderUser) {
      throw new AppError("Sender user is not exists!");
    }

    const createStatementUseCase = container.resolve(CreateStatementUseCase);

    await createStatementUseCase.execute({
      amount: amount * -1,
      description,
      type: OperationType.TRANSFER,
      user_id: senderUser.id as string,
    });
  }
}
