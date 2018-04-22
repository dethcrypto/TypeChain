import { BigNumber } from "bignumber.js";

function isBigNumber(obj: any): obj is BigNumber {
  return obj.constructor.name === "BigNumber";
}

export interface IBigNumberWrapper {
  bigNumber: true;
  value: number;
}

export function createBigNumberWrapper(value: number): IBigNumberWrapper {
  return {
    bigNumber: true,
    value,
  };
}

function rewrapBigNumber(bn: BigNumber): IBigNumberWrapper {
  return createBigNumberWrapper(bn.toNumber());
}

export function rewrapBigNumbers(object: any): object {
  if (isBigNumber(object)) {
    return rewrapBigNumber(object);
  }

  const rewrappedBigNumberObject: any = {} as any;
  Object.keys(object).forEach(k => {
    const v = object[k];
    if (isBigNumber(v)) {
      rewrappedBigNumberObject[k] = rewrapBigNumber(v);
    } else {
      rewrappedBigNumberObject[k] = v;
    }
  });

  return rewrappedBigNumberObject;
}
