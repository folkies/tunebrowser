describe('date-fns', () => {
    test('should write day as UTC', () => {
        const day = new Date("2019-12-01T00:00:00");
        const obj = { day };
        const json = JSON.stringify(obj);
        expect(json).toBe('{"day":"2019-11-30T23:00:00.000Z"}');
    });

    test('should deserialize day', () => {
        const json = '{"day":"2019-11-30T23:00:00.000Z"}';
        const obj= JSON.parse(json);
        const date = new Date(obj.day)
        expect(date.toDateString()).toBe('Sun Dec 01 2019');
        expect(date.getDate()).toBe(1);
        expect(date.getMonth()).toBe(11);
    });
});
