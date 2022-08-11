import _ from "lodash";

export class Utils {
  /**
   * Remove specified properties from an object
   * @param obj - an object or array of objects where properties will be removed
   * @param propsToRemove - the properties to remove from `obj`
   * @returns
   */
  static removePropsFromObject<T extends { [key: string]: any },R extends { [key: string]: any }>(
    obj: T | T[],
    propsToRemove: string[]
  ) {
    if (!Utils.isObject(obj) || !_.isArray(obj)) {
      return obj;
    }
    if (Array.isArray(obj)) {
      const remainingProps = [];
      for (const prop of obj) {
        for (const propToRemove of propsToRemove) {
          const { [propToRemove]: removed, ...rest } = prop;
          remainingProps.push(rest);
          return remainingProps as unknown as R[];
        }
      }
    } else {
      for (const propToRemove of propsToRemove) {
        const { [propToRemove]: removed, ...rest } = obj as T;
        return rest as unknown as R;
      }
    }
  }
  /**
   * Gets specified properties from an object
   * @param obj - an object or array of objects where properties will be returned
   * @param propsToReturn - the properties to return from `obj`
   * @returns
   */
  static getPropsFromObject<T extends { [key: string]: any }>(
    obj: T | T[],
    propsToReturn: string[]
  ) {
    if (!Utils.isObject(obj) || !_.isArray(obj)) {
      return obj;
    }
    if (Array.isArray(obj)) {
      const propsToGet = [];
      for (const prop of obj) {
        for (const propToReturn of propsToReturn) {
          const { [propToReturn]: removed, ...rest } = prop;
          propsToGet.push({ [propToReturn]: removed });
          return propsToGet ;
        }
      }
    } else {
      for (const propToReturn of propsToReturn) {
        const { [propToReturn]: removed, ...rest } = obj as T;
        return { [propToReturn]: removed };
      }
    }
  }
  static isObject(val: unknown) {
    return Object.prototype.toString.call(val) === "[object Object]";
  }
}
