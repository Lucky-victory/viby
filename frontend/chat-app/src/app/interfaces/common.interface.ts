export type DateType = string | number;
export interface IResponse<T>{
    data: T | null,
    message?: string;
    
}