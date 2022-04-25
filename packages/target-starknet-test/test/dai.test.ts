import fs from "fs";
import { Contract, Provider, defaultProvider } from "starknet";
import { contract as _contract } from "../types/contract";
import { expect } from 'earljs'

describe('Type Transformation', () => {
    let contract: Contract;

    before(async () => {
      const compiledAbi = JSON.parse(
        fs.readFileSync("./example-abis/contract.json").toString("ascii")
      );

      // const provider = new Provider({ baseUrl: "http://localhost:5000" });
      console.log("Deploying contract");
      const response = await defaultProvider.deployContract({
        contract: compiledAbi,
      });
      await defaultProvider.waitForTransaction(response.transaction_hash);
      const address = response.address || '';
      console.log('address', address);
      contract = (new Contract(compiledAbi.abi, address) as _contract);
      const x = await contract.request_felt(3);
      console.log(x);
    });

    describe('Request Type Transformation', () => {
      it('Parsing the felt in request', async () => {
        //return expect(contract.request_felt(3)).resolves.not.toThrow();
        const x = await contract.request_felt(3);
        console.log(x);
        // expect(await contract.request_felt(3)).toThrow();
      });

      /*
      it('Parsing the array of felt in request', async () => {
        return expect(contract.request_array_of_felts([1, 2])).resolves.not.toThrow();
      });

      it('Parsing the struct in request', async () => {
        return expect(contract.request_struct({ x: 1, y: 2 })).resolves.not.toThrow();
      });

      it('Parsing the array of structs in request', async () => {
        return expect(contract.request_array_of_structs([{ x: 1, y: 2 }])).resolves.not.toThrow();
      });

      it('Parsing the nested structs in request', async () => {
        return expect(
          contract.request_nested_structs({
            p1: { x: 1, y: 2 },
            p2: { x: 3, y: 4 },
            extra: 5,
          })
        ).resolves.not.toThrow();
      });

      it('Parsing the tuple in request', async () => {
        return expect(contract.request_tuple([1, 2])).resolves.not.toThrow();
      });

      it('Parsing the multiple types in request', async () => {
        return expect(contract.request_mixed_types(2, { x: 1, y: 2 }, [1])).resolves.not.toThrow();
      });
    });

    describe('Response Type Transformation', () => {
      it('Parsing the felt in response', async () => {
        const { res } = await contract.get_felt();
        expect(res).toStrictEqual(toBN(4));
      });

      it('Parsing the array of felt in response', async () => {
        const result = await contract.get_array_of_felts();
        const [res] = result;
        expect(res).toStrictEqual([toBN(4), toBN(5)]);
        expect(res).toStrictEqual(result.res);
      });

      it('Parsing the array of structs in response', async () => {
        const result = await contract.get_struct();
        const [res] = result;
        expect(res).toStrictEqual({ x: toBN(1), y: toBN(2) });
        expect(res).toStrictEqual(result.res);
      });

      it('Parsing the array of structs in response', async () => {
        const result = await contract.get_array_of_structs();
        const [res] = result;
        expect(res).toStrictEqual([{ x: toBN(1), y: toBN(2) }]);
        expect(res).toStrictEqual(result.res);
      });

      it('Parsing the nested structs in response', async () => {
        const result = await contract.get_nested_structs();
        const [res] = result;
        expect(res).toStrictEqual({
          p1: { x: toBN(1), y: toBN(2) },
          p2: { x: toBN(3), y: toBN(4) },
          extra: toBN(5),
        });
        expect(res).toStrictEqual(result.res);
      });

      it('Parsing the tuple in response', async () => {
        const result = await contract.get_tuple();
        const [res] = result;
        expect(res).toStrictEqual([toBN(1), toBN(2), toBN(3)]);
        expect(res).toStrictEqual(result.res);
      });

      it('Parsing the multiple types in response', async () => {
        const result = await contract.get_mixed_types();
        const [tuple, number, array, point] = result;
        expect(tuple).toStrictEqual([toBN(1), toBN(2)]);
        expect(number).toStrictEqual(toBN(3));
        expect(array).toStrictEqual([toBN(4)]);
        expect(point).toStrictEqual({ x: toBN(1), y: toBN(2) });
        expect(tuple).toStrictEqual(result.tuple);
        expect(number).toStrictEqual(result.number);
        expect(array).toStrictEqual(result.array);
        expect(point).toStrictEqual(result.point);
      });
      */
    });
  });
