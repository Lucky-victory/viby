import _ from "lodash";

export class Utils {
  /**
   * Remove specified properties from an object
   * @param Obj - an object or array of objects where properties will be removed
   * @param propsToRemove - the properties to remove from `obj`
   * @returns
   */
  static removePropsFromObject<T extends { [key: string]: any }>(
    obj: T | T[],
    propsToRemove: string[]
  ) {
    const Obj = JSON.parse(JSON.stringify(obj));

    if (!(Utils.isObject(Obj) || _.isArray(Obj))) {
      return obj;
    }
    const propsToRemoveObj: { [key: string]: any } = {};
    for (const propToRemove of propsToRemove) {
      propsToRemoveObj[propToRemove] = true;
    }
    const remainingProps = [];
    if (Array.isArray(Obj)) {
      const newObj: { [key: string]: any } = {};

      for (const item of Obj) {
        if (Utils.isObject(item)) {
          for (const prop in item) {
            if (
              propsToRemoveObj[prop] ||
              !Object.prototype.hasOwnProperty.call(item, prop)
            ) {
              continue;
            }
            newObj[prop] = item[prop];
          }
          remainingProps.push(newObj);
        }
      }
      return remainingProps as T[];
    }
    const newSingleObj: { [key: string]: any } = {};

    for (const prop in Obj) {
      if (
        propsToRemoveObj[prop] ||
        !Object.prototype.hasOwnProperty.call(Obj, prop)
      ) {
        continue;
      }
      newSingleObj[prop] = Obj[prop];
    }
    return newSingleObj as T;
  }
  /**
   * Gets specified properties from an object
   * @param Obj - an object or array of objects where properties will be returned
   * @param propsToReturn - the properties to return from `obj`
   * @returns
   */
  static getPropsFromObject<T extends { [key: string]: any }>(
    obj: T | T[],
    propsToReturn: string[]
  ) {
    const Obj: T | T[] = JSON.parse(JSON.stringify(obj));
    if (!(Utils.isObject(Obj) || _.isArray(Obj))) {
      return obj;
    }
    const propsToReturnObj: { [key: string]: any } = {};
    for (const propToReturn of propsToReturn) {
      propsToReturnObj[propToReturn] = true;
    }
    /**
     * If `Obj` an array use this
     */
    if (Array.isArray(Obj)) {
      const propsToGet = [];
      const newSingleObj: { [key: string]: any } = {};
      for (const item of Obj) {
        for (const prop in item) {
          if (
            !propsToReturnObj[prop] ||
            !Object.prototype.hasOwnProperty.call(Obj, prop)
          ) {
            newSingleObj[prop] = item[prop];
            propsToGet.push(newSingleObj);
            continue;
          }
        }
      }
      return propsToGet as T[];
    }

    //  otherwise use this
    const newSingleObj: { [key: string]: any } = {};
    for (const prop in Obj) {
      if (
        propsToReturnObj[prop] ||
        !Object.prototype.hasOwnProperty.call(Obj, prop)
      ) {
        newSingleObj[prop] = Obj[prop];
        continue;
      }
    }
    return newSingleObj as T;
  }
  static isObject(val: unknown) {
    return Object.prototype.toString.call(val) === "[object Object]";
  }
}
