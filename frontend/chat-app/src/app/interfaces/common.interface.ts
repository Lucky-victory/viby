export type DateType = string | number|Date|null;
export interface IResponse<T>{
    data: T | null,
    message?: string;
    
}