import { reformatWeb3ArgsType, DecodedLogEntry } from "../../runtime/typechain-runtime";
import { expect } from "chai";

describe("typechain-runtime", () => {
  describe("reformatWeb3ArgsType", () => {
    it("should reformat args", () => {
      const expectedLogEntry: DecodedLogEntry<any> = { args: { _dummyKey: 1 } } as any;
      const reformattedLogEntry = reformatWeb3ArgsType(expectedLogEntry);

      expect(reformattedLogEntry).to.be.deep.eq({
        args: {
          dummyKey: 1,
        },
      });
    });
  });
});
