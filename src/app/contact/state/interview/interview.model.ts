export enum QuestionStatusEnum {
  Pending = "pending",
  Approved = "approved",
  Rejected = "rejected"
}

export interface QuestionDto {
  id: number;
  uniqueId: string;
  questionText: string;
  status: QuestionStatusEnum;
  responseOrReason: string;
  createdAt: string;
  updatedAt: string;
}
